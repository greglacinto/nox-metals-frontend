'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/ui/Button';
import { LogOut, Package, Users, Activity } from 'lucide-react';

const DashboardPage = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Nox Metals</h1>
                <p className="text-sm sm:text-base text-gray-600">Product Management Dashboard</p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <span className="text-sm sm:text-base text-gray-700">
                  Welcome, {user?.email} ({user?.role})
                </span>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Products Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Package className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Products
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {user?.role === 'admin' ? 'Manage Products' : 'View Products'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <a href="/products" className="font-medium text-blue-700 hover:text-blue-900">
                    View all products
                  </a>
                </div>
              </div>
            </div>

            {/* Users Card (Admin Only) */}
            {user?.role === 'admin' && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Users
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Manage Users
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a href="/users" className="font-medium text-blue-700 hover:text-blue-900">
                      View all users
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Audit Logs Card (Admin Only) */}
            {user?.role === 'admin' && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Activity className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Audit Logs
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          View Activity
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a href="/audit" className="font-medium text-blue-700 hover:text-blue-900">
                      View audit logs
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage; 