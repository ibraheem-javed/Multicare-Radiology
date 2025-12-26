import { useState } from 'react'
import { usePage, Link } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { Button } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Plus, Minus } from 'lucide-react'

type Patient = {
  id: string
  firstName: string
  lastName: string
  nationalIdNumber?: string | null
  medicalRecordNumber: string
  addressLine: string
  city: string
  phone?: string | null
}

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

export default function PatientAuditLogs() {
  const { patient, patientLogs, requestLogs, reportLogs } = usePage<{
    patient: Patient
    patientLogs: AuditLog[]
    requestLogs: AuditLog[]
    reportLogs: AuditLog[]
  }>().props

  const [expandedLogId, setExpandedLogId] = useState<string | null>(null)

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

  const toggleExpand = (logId: string) => {
    setExpandedLogId(expandedLogId === logId ? null : logId)
  }

  const getFieldOrder = (entityType: string) => {
    switch (entityType) {
      case 'Patient':
        return [
          'firstName',
          'lastName',
          'dateOfBirth',
          'gender',
          'age',
          'phone',
          'medicalRecordNumber',
          'nationalIdType',
          'nationalIdNumber',
          'addressLine',
          'city',
          'postalCode',
          'emergencyContactName',
          'emergencyContactPhone',
          'allergies',
        ]
      case 'Request':
        return ['procedureType', 'requestDate', 'status', 'clinicalHistory', 'urgency']
      case 'Report':
        return ['findings', 'impression', 'status', 'reportDate']
      default:
        return []
    }
  }

  const renderChangesTable = (log: AuditLog) => {
    if (!log.changes) return null

    const { old: oldData, new: newData } = log.changes
    if (!oldData && !newData) return null

    const allKeys = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})])

    const allFields = Array.from(allKeys).filter(
      (key) =>
        !['id', 'createdAt', 'updatedAt', 'userId', 'patientId', 'requestId', 'reportId'].includes(
          key
        ) && typeof (oldData?.[key] || newData?.[key]) !== 'object'
    )

    const fieldOrder = getFieldOrder(log.entityType)
    const orderedFields = [
      ...allFields
        .filter((f) => fieldOrder.includes(f))
        .sort((a, b) => {
          return fieldOrder.indexOf(a) - fieldOrder.indexOf(b)
        }),
      ...allFields.filter((f) => !fieldOrder.includes(f)).sort(),
    ]

    if (orderedFields.length === 0) return null

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Field</TableHead>
            <TableHead className="w-1/3">Before</TableHead>
            <TableHead className="w-1/3">After</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderedFields.map((field) => {
            const oldValue = oldData?.[field]
            const newValue = newData?.[field]
            const hasChanged = oldValue !== newValue

            return (
              <TableRow key={field} className={hasChanged ? 'bg-yellow-50' : ''}>
                <TableCell className="font-medium capitalize">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </TableCell>
                <TableCell className="text-sm">
                  {oldValue !== undefined && oldValue !== null ? String(oldValue) : '-'}
                </TableCell>
                <TableCell className="text-sm">
                  {newValue !== undefined && newValue !== null ? String(newValue) : '-'}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  }

  return (
    <>
      <Head title={`Audit Logs - ${patient.firstName} ${patient.lastName}`} />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Patient Audit Logs</h1>
          </div>

          <Link href="/audit-logs">
            <Button variant="outline">Back to Audit Logs</Button>
          </Link>
        </div>

        <div className="border rounded-lg p-6 bg-white">
          <h2 className="text-lg font-medium border-b pb-3 mb-4">Patient Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Patient Name:</span>
              <span className="ml-2 font-medium">
                {patient.firstName} {patient.lastName}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">CNIC:</span>
              <span className="ml-2 font-medium font-mono">{patient.nationalIdNumber || '-'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">MRN Number:</span>
              <span className="ml-2 font-medium font-mono">{patient.medicalRecordNumber}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Phone:</span>
              <span className="ml-2 font-medium">{patient.phone || '-'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Address:</span>
              <span className="ml-2 font-medium">
                {patient.addressLine}, {patient.city}
              </span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="patient" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="patient"
              className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800"
            >
              Patient ({patientLogs.length})
            </TabsTrigger>
            <TabsTrigger
              value="request"
              className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"
            >
              Request ({requestLogs.length})
            </TabsTrigger>
            <TabsTrigger
              value="report"
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
            >
              Report ({reportLogs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patient">
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>User Email</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead className="text-center w-20">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patientLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500">
                        No patient logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    patientLogs.map((log) => (
                      <>
                        <TableRow
                          key={log.id}
                          className={
                            log.action !== 'accessed' ? 'hover:bg-gray-50 cursor-pointer' : ''
                          }
                          onClick={
                            log.action !== 'accessed' ? () => toggleExpand(log.id) : undefined
                          }
                        >
                          <TableCell className="text-xs">{formatDate(log.createdAt)}</TableCell>
                          <TableCell>
                            {log.user ? `${log.user.firstName} ${log.user.lastName}` : '-'}
                          </TableCell>
                          <TableCell className="text-sm">{log.user?.email || '-'}</TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${getActionBadgeColor(log.action)}`}
                            >
                              {formatAction(log.action)}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {log.ipAddress || '-'}
                          </TableCell>
                          <TableCell className="text-center">
                            {log.action !== 'accessed' && (
                              <>
                                {expandedLogId === log.id ? (
                                  <Minus className="h-4 w-4 mx-auto" />
                                ) : (
                                  <Plus className="h-4 w-4 mx-auto" />
                                )}
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                        {log.action !== 'accessed' && expandedLogId === log.id && (
                          <TableRow>
                            <TableCell colSpan={6} className="bg-gray-50 p-4">
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">Change Details</h4>
                                {renderChangesTable(log)}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="request">
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>User Email</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead className="text-center w-20">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requestLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500">
                        No request logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    requestLogs.map((log) => (
                      <>
                        <TableRow
                          key={log.id}
                          className={
                            log.action !== 'accessed' ? 'hover:bg-gray-50 cursor-pointer' : ''
                          }
                          onClick={
                            log.action !== 'accessed' ? () => toggleExpand(log.id) : undefined
                          }
                        >
                          <TableCell className="text-xs">{formatDate(log.createdAt)}</TableCell>
                          <TableCell>
                            {log.user ? `${log.user.firstName} ${log.user.lastName}` : '-'}
                          </TableCell>
                          <TableCell className="text-sm">{log.user?.email || '-'}</TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${getActionBadgeColor(log.action)}`}
                            >
                              {formatAction(log.action)}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {log.ipAddress || '-'}
                          </TableCell>
                          <TableCell className="text-center">
                            {log.action !== 'accessed' && (
                              <>
                                {expandedLogId === log.id ? (
                                  <Minus className="h-4 w-4 mx-auto" />
                                ) : (
                                  <Plus className="h-4 w-4 mx-auto" />
                                )}
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                        {log.action !== 'accessed' && expandedLogId === log.id && (
                          <TableRow>
                            <TableCell colSpan={6} className="bg-gray-50 p-4">
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">Change Details</h4>
                                {renderChangesTable(log)}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="report">
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>User Email</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead className="text-center w-20">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500">
                        No report logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    reportLogs.map((log) => (
                      <>
                        <TableRow
                          key={log.id}
                          className={
                            log.action !== 'accessed' ? 'hover:bg-gray-50 cursor-pointer' : ''
                          }
                          onClick={
                            log.action !== 'accessed' ? () => toggleExpand(log.id) : undefined
                          }
                        >
                          <TableCell className="text-xs">{formatDate(log.createdAt)}</TableCell>
                          <TableCell>
                            {log.user ? `${log.user.firstName} ${log.user.lastName}` : '-'}
                          </TableCell>
                          <TableCell className="text-sm">{log.user?.email || '-'}</TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${getActionBadgeColor(log.action)}`}
                            >
                              {formatAction(log.action)}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {log.ipAddress || '-'}
                          </TableCell>
                          <TableCell className="text-center">
                            {log.action !== 'accessed' && (
                              <>
                                {expandedLogId === log.id ? (
                                  <Minus className="h-4 w-4 mx-auto" />
                                ) : (
                                  <Plus className="h-4 w-4 mx-auto" />
                                )}
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                        {log.action !== 'accessed' && expandedLogId === log.id && (
                          <TableRow>
                            <TableCell colSpan={6} className="bg-gray-50 p-4">
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">Change Details</h4>
                                {renderChangesTable(log)}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
