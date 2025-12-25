import { useState } from 'react'
import { usePage, router, Link } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { format } from 'date-fns'
import { CalendarIcon, X } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Calendar } from '~/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { cn } from '~/lib/utils'

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
  startDate?: string
  endDate?: string
}

type SearchResult = {
  id: string
  firstName: string
  lastName: string
  nationalIdNumber: string | null
  phone: string | null
  medicalRecordNumber: string
}

export default function AuditLogs() {
  const { logs, searchResults, searchTerm, pagination, filters } = usePage<{
    logs: AuditLog[]
    searchResults: SearchResult[]
    searchTerm: string
    pagination: Pagination
    filters: Filters
  }>().props

  const [localFilters, setLocalFilters] = useState<Filters>(filters || {})
  const [search, setSearch] = useState(searchTerm || '')

  const handleSearch = () => {
    if (search.trim()) {
      router.get('/audit-logs', { search: search.trim() })
    } else {
      router.get('/audit-logs')
    }
  }

  const handleClearSearch = () => {
    setSearch('')
    router.get('/audit-logs')
  }

  const extractPatientInfo = (log: AuditLog) => {
    const changes = log.changes
    if (!changes) return null

    const data = changes.new || changes.old
    if (!data) return null

    if (log.entityType === 'Patient') {
      return {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        medicalRecordNumber: data.medicalRecordNumber || '',
        nationalIdNumber: data.nationalIdNumber || '',
        phone: data.phone || '',
      }
    }

    if (data.patient) {
      return {
        firstName: data.patient.firstName || '',
        lastName: data.patient.lastName || '',
        medicalRecordNumber: data.patient.medicalRecordNumber || '',
        nationalIdNumber: data.patient.nationalIdNumber || '',
        phone: data.patient.phone || '',
      }
    }

    return null
  }

  const displayLogs = logs

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
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

  const formatAction = (action: string) => {
    return action.charAt(0).toUpperCase() + action.slice(1)
  }

  const getActionBadgeColor = (action: string) => {
    switch (action.toLowerCase()) {
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

        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Search by patient name, MRN, or CNIC..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch()
                  }
                }}
                className="pr-8"
              />
              {search && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300 -ml-3" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <Label className="text-sm font-medium whitespace-nowrap">Start Date:</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'flex-1 justify-start text-left font-normal',
                          !localFilters.startDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {localFilters.startDate ? (
                          format(new Date(localFilters.startDate), 'PP')
                        ) : (
                          <span>Pick a Date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          localFilters.startDate ? new Date(localFilters.startDate) : undefined
                        }
                        onSelect={(date) => {
                          handleFilterChange('startDate', date ? format(date, 'yyyy-MM-dd') : '')
                        }}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center gap-2 flex-1">
                  <Label className="text-sm font-medium whitespace-nowrap">End Date:</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'flex-1 justify-start text-left font-normal',
                          !localFilters.endDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {localFilters.endDate ? (
                          format(new Date(localFilters.endDate), 'PP')
                        ) : (
                          <span>Pick a Date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={localFilters.endDate ? new Date(localFilters.endDate) : undefined}
                        onSelect={(date) => {
                          handleFilterChange('endDate', date ? format(date, 'yyyy-MM-dd') : '')
                        }}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button>Apply</Button>
                <Button variant="outline">Reset</Button>
                <Button variant="secondary">Export Logs</Button>
              </div>

              <p className="text-sm text-muted-foreground italic">
                Search and Export Logs functionality coming soon
              </p>
            </div>
          </div>
        </div>

        {searchResults.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Found {searchResults.length} patient(s) matching "{searchTerm}"
              </p>
              <Button variant="outline" size="sm" onClick={handleClearSearch}>
                Clear Search
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>CNIC</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>MRN #</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        {patient.firstName} {patient.lastName}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {patient.nationalIdNumber || '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {patient.phone || '-'}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {patient.medicalRecordNumber}
                      </TableCell>
                      <TableCell className="text-center">
                        <Link href={`/audit-logs/${patient.id}`}>
                          <Button variant="link" size="sm" className="text-blue-600">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : searchTerm ? (
          <div className="text-center py-12 text-gray-500">
            <p>No patients found matching "{searchTerm}"</p>
            <Button variant="outline" size="sm" onClick={handleClearSearch} className="mt-4">
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>CNIC</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>MRN #</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {displayLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      No audit logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  displayLogs.map((log) => {
                    const patientInfo = extractPatientInfo(log)

                    return (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs">{formatDate(log.createdAt)}</TableCell>
                        <TableCell>
                          {patientInfo ? `${patientInfo.firstName} ${patientInfo.lastName}` : '-'}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {patientInfo?.nationalIdNumber || '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {patientInfo?.phone || '-'}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {patientInfo?.medicalRecordNumber || '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${getActionBadgeColor(log.action)}`}
                          >
                            {formatAction(log.action)}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {!searchTerm && displayLogs.length > 0 && (
          <div className="text-center text-sm text-gray-600">
            Showing latest {displayLogs.length} audit log entries
          </div>
        )}
      </div>
    </>
  )
}
