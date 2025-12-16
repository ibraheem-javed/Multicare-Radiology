import { useState } from 'react'
import { usePage, router } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Card } from '~/components/ui/card'

type AuditLog = {
  id: string
  action: 'created' | 'updated' | 'deleted' | 'accessed'
  entityType: 'Patient' | 'Request' | 'Report' | 'User'
  entityId: string
  changes: {
    old?: Record<string, any>
    new?: Record<string, any>
  } | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  } | null
}

type Pagination = {
  currentPage: number
  lastPage: number
  total: number
  perPage: number
}

type Filters = {
  entityType?: string
  action?: string
  userId?: string
  entityId?: string
  startDate?: string
  endDate?: string
}

export default function AuditLogs() {
  const { logs, pagination, filters } = usePage<{
    logs: AuditLog[]
    pagination: Pagination
    filters: Filters
  }>().props

  const [localFilters, setLocalFilters] = useState<Filters>(filters || {})
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null)

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    router.get('/audit-logs', localFilters)
  }

  const resetFilters = () => {
    setLocalFilters({})
    router.get('/audit-logs')
  }

  const goToPage = (page: number) => {
    router.get('/audit-logs', { ...localFilters, page })
  }

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-green-100 text-green-800'
      case 'updated':
        return 'bg-blue-100 text-blue-800'
      case 'deleted':
        return 'bg-red-100 text-red-800'
      case 'accessed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const toggleExpand = (logId: string) => {
    setExpandedLogId(expandedLogId === logId ? null : logId)
  }

  const patientFieldOrder = [
    'id',
    'medicalRecordNumber',
    'firstName',
    'lastName',
    'dateOfBirth',
    'gender',
    'phone',
    'nationalIdType',
    'nationalIdNumber',
    'addressLine',
    'city',
    'postalCode',
    'emergencyContactName',
    'emergencyContactPhone',
    'allergies',
    'createdAt',
    'updatedAt',
  ]

  const formatFieldName = (fieldName: string) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

  const formatFieldValue = (value: any) => {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  const getOrderedFields = (data: Record<string, any>, entityType: string) => {
    if (entityType === 'Patient') {
      return patientFieldOrder.filter((field) => field in data)
    }
    return Object.keys(data)
  }

  const isFieldChanged = (
    field: string,
    oldData?: Record<string, any>,
    newData?: Record<string, any>
  ) => {
    if (!oldData || !newData) return false
    return oldData[field] !== newData[field]
  }

  return (
    <>
      <Head title="Audit Logs" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Audit Logs</h1>
          <div className="text-sm text-gray-600">
            Total: {pagination.total} logs | Page {pagination.currentPage} of {pagination.lastPage}
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <h2 className="text-lg font-medium mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Entity Type</Label>
              <Select
                value={localFilters.entityType || undefined}
                onValueChange={(value) => handleFilterChange('entityType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All entities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Patient">Patient</SelectItem>
                  <SelectItem value="Request">Request</SelectItem>
                  <SelectItem value="Report">Report</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Action</Label>
              <Select
                value={localFilters.action || undefined}
                onValueChange={(value) => handleFilterChange('action', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="updated">Updated</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                  <SelectItem value="accessed">Accessed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Entity ID</Label>
              <Input
                type="text"
                placeholder="Filter by entity ID..."
                value={localFilters.entityId || ''}
                onChange={(e) => handleFilterChange('entityId', e.target.value)}
              />
            </div>

            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={localFilters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>

            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={localFilters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
          </div>
        </Card>

        {/* Audit Logs Table */}
        <div className="border rounded-md overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Timestamp</th>
                <th className="p-2">User</th>
                <th className="p-2">Action</th>
                <th className="p-2">Entity</th>
                <th className="p-2">Entity ID</th>
                <th className="p-2">IP Address</th>
                <th className="p-2">Details</th>
              </tr>
            </thead>

            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">
                    No audit logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <>
                    <tr key={log.id} className="border-t hover:bg-gray-50">
                      <td className="p-2 text-xs">{formatDate(log.createdAt)}</td>
                      <td className="p-2">
                        {log.user ? (
                          <div>
                            <div className="font-medium">
                              {log.user.firstName} {log.user.lastName}
                            </div>
                            <div className="text-xs text-gray-600">{log.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">System</span>
                        )}
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="p-2">{log.entityType}</td>
                      <td className="p-2">
                        <span className="font-mono text-xs">{log.entityId.slice(0, 8)}...</span>
                      </td>
                      <td className="p-2 text-xs">{log.ipAddress || '-'}</td>
                      <td className="p-2">
                        {log.changes && (
                          <button
                            onClick={() => toggleExpand(log.id)}
                            className="text-blue-600 hover:underline text-xs"
                          >
                            {expandedLogId === log.id ? 'Hide' : 'Show'} changes
                          </button>
                        )}
                      </td>
                    </tr>

                    {expandedLogId === log.id && log.changes && (
                      <tr className="border-t bg-gray-50">
                        <td colSpan={7} className="p-4">
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs border-collapse">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="p-2 text-left border font-medium">Field</th>
                                  {log.changes.old && (
                                    <th className="p-2 text-left border font-medium">Before</th>
                                  )}
                                  {log.changes.new && (
                                    <th className="p-2 text-left border font-medium">After</th>
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {(() => {
                                  const data = log.changes.old || log.changes.new || {}
                                  const fields = getOrderedFields(data, log.entityType)

                                  return fields.map((field) => {
                                    const changed = isFieldChanged(
                                      field,
                                      log.changes.old,
                                      log.changes.new
                                    )
                                    const rowClass = changed
                                      ? 'bg-yellow-50'
                                      : 'bg-white hover:bg-gray-50'

                                    return (
                                      <tr key={field} className={rowClass}>
                                        <td className="p-2 border font-medium text-gray-700">
                                          {formatFieldName(field)}
                                        </td>
                                        {log.changes.old && (
                                          <td className="p-2 border font-mono">
                                            {formatFieldValue(log.changes.old[field])}
                                          </td>
                                        )}
                                        {log.changes.new && (
                                          <td
                                            className={`p-2 border font-mono ${
                                              changed ? 'font-semibold text-blue-700' : ''
                                            }`}
                                          >
                                            {formatFieldValue(log.changes.new[field])}
                                          </td>
                                        )}
                                      </tr>
                                    )
                                  })
                                })()}
                              </tbody>
                            </table>
                          </div>

                          {log.userAgent && (
                            <div className="mt-4">
                              <h4 className="font-medium text-sm mb-1">User Agent:</h4>
                              <p className="text-xs text-gray-600">{log.userAgent}</p>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.lastPage > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage === 1}
              onClick={() => goToPage(pagination.currentPage - 1)}
            >
              Previous
            </Button>

            <div className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.lastPage}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage === pagination.lastPage}
              onClick={() => goToPage(pagination.currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
