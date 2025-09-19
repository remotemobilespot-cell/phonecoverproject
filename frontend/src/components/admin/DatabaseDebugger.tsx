import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RefreshCw, Database, AlertCircle, CheckCircle } from 'lucide-react';

interface TableInfo {
  name: string;
  count: number;
  status: 'success' | 'error' | 'loading';
  error?: string;
}

const DatabaseDebugger: React.FC = () => {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const checkDatabaseTables = async () => {
    setLoading(true);
    const tableNames = [
      'orders',
      'profiles', 
      'blog_posts',
      'phone_models',
      'store_locations',
      'contact_messages',
      'faqs',
      'newsletter_subscribers',
      'testimonials'
    ];

    const results: TableInfo[] = [];

    for (const tableName of tableNames) {
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (error) {
          results.push({
            name: tableName,
            count: 0,
            status: 'error',
            error: error.message
          });
        } else {
          results.push({
            name: tableName,
            count: count || 0,
            status: 'success'
          });
        }
      } catch (err) {
        results.push({
          name: tableName,
          count: 0,
          status: 'error',
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    }

    setTables(results);
    setLoading(false);
  };

  const testConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id')
        .limit(1);

      if (error) {
        console.error('Connection test failed:', error);
        return false;
      }
      
      console.log('Connection test successful');
      return true;
    } catch (err) {
      console.error('Connection test error:', err);
      return false;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Status & Debugger
        </CardTitle>
        <CardDescription>
          Check database table status and connectivity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={checkDatabaseTables}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Check Tables
          </Button>
          <Button 
            variant="outline"
            onClick={testConnection}
          >
            Test Connection
          </Button>
        </div>

        {tables.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Table Status:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {tables.map((table) => (
                <div
                  key={table.name}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex items-center gap-2">
                    {table.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-mono text-sm">{table.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant={table.status === 'success' ? 'default' : 'destructive'}>
                      {table.count} rows
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            {tables.some(t => t.status === 'error') && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <h5 className="font-medium text-red-800 mb-2">Errors Found:</h5>
                {tables
                  .filter(t => t.status === 'error')
                  .map(table => (
                    <div key={table.name} className="text-sm text-red-700">
                      <strong>{table.name}:</strong> {table.error}
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseDebugger;
