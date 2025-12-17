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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Entity ID</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  No audit logs found
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                  <>
                    <TableRow key={log.id}>
                      <TableCell className="text-xs">{formatDate(log.createdAt)}</TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`}
                        >
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell>{log.entityType}</TableCell>
                      <TableCell>
                        <span className="font-mono text-xs">{log.entityId.slice(0, 8)}...</span>
                      </TableCell>
                      <TableCell className="text-xs">{log.ipAddress || '-'}</TableCell>
                      <TableCell>
                        {log.changes && (
                          <button
                            onClick={() => toggleExpand(log.id)}
                            className="text-blue-600 hover:underline text-xs"
                          >
                            {expandedLogId === log.id ? 'Hide' : 'Show'} changes
                          </button>
                        )}
                      </TableCell>
                    </TableRow>

                    {expandedLogId === log.id && log.changes && (
                      <TableRow className="bg-muted">
                        <TableCell colSpan={7} className="p-4">
                          <div className="space-y-4">
                            <Table className="text-xs">
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Field</TableHead>
                                  {log.changes!.old && (
                                    <TableHead>Before</TableHead>
                                  )}
                                  {log.changes!.new && (
                                    <TableHead>After</TableHead>
                                  )}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {(() => {
                                  const changes = log.changes!
                                  const data = changes.old || changes.new || {}
                                  const fields = getOrderedFields(data, log.entityType)

                                  return fields.map((field) => {
                                    const changed = isFieldChanged(
                                      field,
                                      changes.old,
                                      changes.new
                                    )
                                    const rowClass = changed
                                      ? 'bg-yellow-50'
                                      : ''

                                    return (
                                      <TableRow key={field} className={rowClass}>
                                        <TableCell className="font-medium text-gray-700">
                                          {formatFieldName(field)}
                                        </TableCell>
                                        {changes.old && (
                                          <TableCell className="font-mono">
                                            {formatFieldValue(changes.old[field])}
                                          </TableCell>
                                        )}
                                        {changes.new && (
                                          <TableCell
                                            className={`font-mono ${
                                              changed ? 'font-semibold text-blue-700' : ''
                                            }`}
                                          >
                                            {formatFieldValue(changes.new[field])}
                                          </TableCell>
                                        )}
                                      </TableRow>
                                    )
                                  })
                                })()}
                              </TableBody>
                            </Table>

                            {log.userAgent && (
                              <div>
                                <h4 className="font-medium text-sm mb-1">User Agent:</h4>
                                <p className="text-xs text-gray-600">{log.userAgent}</p>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
          </TableBody>
        </Table>

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
