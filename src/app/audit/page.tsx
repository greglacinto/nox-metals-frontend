'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Activity, Filter, Calendar, User, Package } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface AuditLog {
  id: number;
  action: string;
  user_email: string;
  product_id: number | null;
  product_name?: string;
  timestamp: string;
  details?: string | object;
}

interface AuditFilters {
  action?: string;
  user_email?: string;
  product_id?: number;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

const AuditPage = () => {
  const router = useRouter();
  const { user, initialize } = useAuthStore();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AuditFilters>({
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Initialize auth state
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Fetch audit logs
  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/audit?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch audit logs');
        }

        const data = await response.json();
        setAuditLogs(data.data.logs || []);
        setPagination(data.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch audit logs';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchAuditLogs();
    }
  }, [user?.role, filters.page, filters.limit, filters.action, filters.user_email, filters.product_id, filters.start_date, filters.end_date]);

  const handleBack = () => {
    router.back();
  };

  const handleFilterChange = (key: keyof AuditFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getActionBadge = (action: string) => {
    const actionColors: { [key: string]: string } = {
      'CREATE': 'bg-green-100 text-green-800',
      'UPDATE': 'bg-blue-100 text-blue-800',
      'DELETE': 'bg-red-100 text-red-800',
      'RESTORE': 'bg-yellow-100 text-yellow-800',
      'LOGIN': 'bg-purple-100 text-purple-800',
      'LOGOUT': 'bg-gray-100 text-gray-800',
    };

    const color = actionColors[action] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {action}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="divide-y divide-gray-200">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error Loading Audit Logs</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <Button onClick={handleBack} variant="secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                    <Activity className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3" />
                    Audit Logs
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">System activity and changes</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                <Button
                  variant="secondary"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  <span className="sm:hidden">Filter</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 sm:space-y-6">
            {/* Filters */}
            {showFilters && (
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Action Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Action
                    </label>
                    <select
                      value={filters.action || ''}
                      onChange={(e) => handleFilterChange('action', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Actions</option>
                      <option value="CREATE">Create</option>
                      <option value="UPDATE">Update</option>
                      <option value="DELETE">Delete</option>
                      <option value="RESTORE">Restore</option>
                    </select>
                  </div>

                  {/* User Email Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User Email
                    </label>
                    <Input
                      type="text"
                      placeholder="Filter by user email..."
                      value={filters.user_email || ''}
                      onChange={(e) => handleFilterChange('user_email', e.target.value)}
                    />
                  </div>

                  {/* Start Date Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={filters.start_date || ''}
                      onChange={(e) => handleFilterChange('start_date', e.target.value)}
                    />
                  </div>

                  {/* End Date Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={filters.end_date || ''}
                      onChange={(e) => handleFilterChange('end_date', e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="flex items-center space-x-1 w-full sm:w-auto justify-center sm:justify-start"
                  >
                    <span>Clear Filters</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Audit Logs Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          {getActionBadge(log.action)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="text-sm text-gray-900">{log.user_email}</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          {log.product_id ? (
                            <div className="flex items-center">
                              <Package className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="text-sm text-gray-900">
                                {log.product_name || `Product ${log.product_id}`}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDate(log.timestamp)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {auditLogs.length === 0 && !isLoading && (
                <div className="text-center py-8 sm:py-12">
                  <Activity className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No audit logs found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No activity has been logged yet.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <nav className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-700">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Next
                  </Button>
                </nav>
              </div>
            )}

            {/* Results Info */}
            <div className="text-center text-xs sm:text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AuditPage; 