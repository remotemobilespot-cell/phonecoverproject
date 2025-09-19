import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Database, 
  Play, 
  Save, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Copy,
  Plus,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface TableInfo {
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string;
}

const DatabaseManager: React.FC = () => {
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');

  // Pre-defined useful queries
  const quickQueries = [
    {
      name: 'Add case_type column to orders',
      query: `ALTER TABLE orders ADD COLUMN IF NOT EXISTS case_type text DEFAULT 'regular';`
    },
    {
      name: 'View all orders with phone models',
      query: `SELECT o.id, o.contact_name, o.contact_email, o.phone_model, o.case_type, o.amount, o.status, o.created_at, pm.brand, pm.model as phone_model_name
FROM orders o
LEFT JOIN phone_models pm ON o.phone_model_id = pm.id
ORDER BY o.created_at DESC
LIMIT 50;`
    },
    {
      name: 'Check table structure',
      query: `SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
ORDER BY table_name, ordinal_position;`
    },
    {
      name: 'Orders by status count',
      query: `SELECT status, COUNT(*) as count 
FROM orders 
GROUP BY status 
ORDER BY count DESC;`
    },
    {
      name: 'Revenue by phone model',
      query: `SELECT pm.brand, pm.model, COUNT(o.id) as orders, SUM(o.amount) as total_revenue
FROM orders o
LEFT JOIN phone_models pm ON o.phone_model_id = pm.id
WHERE o.payment_status = 'paid'
GROUP BY pm.brand, pm.model
ORDER BY total_revenue DESC;`
    },
    {
      name: 'Recent orders (last 24h)',
      query: `SELECT id, contact_name, contact_email, amount, status, created_at
FROM orders 
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;`
    },
    {
      name: 'Update order status bulk',
      query: `-- Example: Update multiple orders to 'processing'
-- UPDATE orders 
-- SET status = 'processing' 
-- WHERE id IN ('order-id-1', 'order-id-2', 'order-id-3');
SELECT 'Replace the order IDs above and uncomment to execute' as message;`
    },
    {
      name: 'Fix missing phone_model_id',
      query: `-- Update orders to set phone_model_id based on phone_model name
UPDATE orders 
SET phone_model_id = pm.id
FROM phone_models pm
WHERE orders.phone_model LIKE '%' || pm.model || '%' 
AND orders.phone_model_id IS NULL;`
    }
  ];

  useEffect(() => {
    fetchTableInfo();
  }, []);

  const fetchTableInfo = async () => {
    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        query: `SELECT 
          table_name, 
          column_name, 
          data_type, 
          is_nullable, 
          column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        ORDER BY table_name, ordinal_position;`
      });

      if (error) throw error;
      setTables(data || []);
    } catch (error: any) {
      console.error('Error fetching table info:', error);
      // Fallback: try direct query
      try {
        const { data, error: fallbackError } = await supabase
          .from('information_schema.columns')
          .select('table_name, column_name, data_type, is_nullable, column_default')
          .eq('table_schema', 'public');

        if (!fallbackError && data) {
          setTables(data);
        }
      } catch (fallbackErr) {
        console.error('Fallback query failed:', fallbackErr);
      }
    }
  };

  const executeQuery = async () => {
    if (!sqlQuery.trim()) {
      toast.error('Please enter a SQL query');
      return;
    }

    setIsExecuting(true);
    setQueryResult(null);

    try {
      // For SELECT queries, use the regular supabase client
      if (sqlQuery.trim().toLowerCase().startsWith('select')) {
        const { data, error } = await supabase.rpc('exec_sql', { query: sqlQuery });
        
        if (error) throw error;
        
        setQueryResult({
          type: 'select',
          data: data,
          rowCount: data?.length || 0
        });
        toast.success(`Query executed successfully! ${data?.length || 0} rows returned.`);
      } else {
        // For DDL/DML queries (ALTER, INSERT, UPDATE, DELETE)
        const { error } = await supabase.rpc('exec_sql', { query: sqlQuery });
        
        if (error) throw error;
        
        setQueryResult({
          type: 'mutation',
          message: 'Query executed successfully!',
          query: sqlQuery
        });
        
        toast.success('Query executed successfully!');
        
        // Refresh table info if it was a schema change
        if (sqlQuery.toLowerCase().includes('alter') || sqlQuery.toLowerCase().includes('create')) {
          await fetchTableInfo();
        }
      }
    } catch (error: any) {
      console.error('SQL execution error:', error);
      setQueryResult({
        type: 'error',
        message: error.message || 'Query execution failed',
        error: error
      });
      toast.error(`Query failed: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const renderQueryResult = () => {
    if (!queryResult) return null;

    if (queryResult.type === 'error') {
      return (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Query Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-red-600 whitespace-pre-wrap text-sm bg-red-50 p-4 rounded">
              {queryResult.message}
            </pre>
          </CardContent>
        </Card>
      );
    }

    if (queryResult.type === 'mutation') {
      return (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Query Executed Successfully
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700">{queryResult.message}</p>
          </CardContent>
        </Card>
      );
    }

    if (queryResult.type === 'select') {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Query Results ({queryResult.rowCount} rows)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {queryResult.data && queryResult.data.length > 0 ? (
              <div className="overflow-auto max-h-96">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      {Object.keys(queryResult.data[0]).map((key) => (
                        <th key={key} className="border border-gray-300 px-4 py-2 text-left font-semibold">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.data.map((row: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {Object.values(row).map((value: any, cellIndex) => (
                          <td key={cellIndex} className="border border-gray-300 px-4 py-2 text-sm">
                            {value === null ? (
                              <span className="text-gray-400 italic">null</span>
                            ) : typeof value === 'object' ? (
                              JSON.stringify(value)
                            ) : (
                              String(value)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No data returned</p>
            )}
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  const groupedTables = tables.reduce((acc, table) => {
    if (!acc[table.table_name]) {
      acc[table.table_name] = [];
    }
    acc[table.table_name].push(table);
    return acc;
  }, {} as Record<string, TableInfo[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Management
          </CardTitle>
          <CardDescription>
            Execute SQL queries, manage database schema, and monitor data
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="query" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="query">SQL Query</TabsTrigger>
          <TabsTrigger value="quick">Quick Actions</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
        </TabsList>

        <TabsContent value="query" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SQL Query Executor</CardTitle>
              <CardDescription>
                Execute custom SQL queries against your database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your SQL query here..."
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="min-h-32 font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button onClick={executeQuery} disabled={isExecuting}>
                  {isExecuting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Execute Query
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setSqlQuery('')}>
                  Clear
                </Button>
                <Button variant="outline" onClick={() => copyToClipboard(sqlQuery)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>

          {queryResult && renderQueryResult()}
        </TabsContent>

        <TabsContent value="quick" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Pre-defined queries for common database operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {quickQueries.map((query, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{query.name}</h4>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSqlQuery(query.query)}
                        >
                          Load
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSqlQuery(query.query);
                            executeQuery();
                          }}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Run
                        </Button>
                      </div>
                    </div>
                    <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
                      {query.query}
                    </pre>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Schema</CardTitle>
              <CardDescription>
                View table structures and column information
              </CardDescription>
              <Button onClick={fetchTableInfo} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(groupedTables).map(([tableName, columns]) => (
                  <Card key={tableName}>
                    <CardHeader>
                      <CardTitle className="text-lg">{tableName}</CardTitle>
                      <CardDescription>
                        {columns.length} columns
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Column</th>
                              <th className="text-left p-2">Type</th>
                              <th className="text-left p-2">Nullable</th>
                              <th className="text-left p-2">Default</th>
                            </tr>
                          </thead>
                          <tbody>
                            {columns.map((column, index) => (
                              <tr key={index} className="border-b">
                                <td className="p-2 font-mono">{column.column_name}</td>
                                <td className="p-2">
                                  <Badge variant="secondary">{column.data_type}</Badge>
                                </td>
                                <td className="p-2">
                                  {column.is_nullable === 'YES' ? (
                                    <Badge variant="outline">Nullable</Badge>
                                  ) : (
                                    <Badge variant="destructive">Not Null</Badge>
                                  )}
                                </td>
                                <td className="p-2 font-mono text-xs">
                                  {column.column_default || '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseManager;