import type Patient from '#models/patient'
import { DateTime } from 'luxon'

export default class PatientDTO {
  /**
   * Format date to readable format: "Jan 01, 2000"
   * Handles both string and DateTime objects from Lucid ORM
   */
  private static formatDate(value: string | DateTime | null): string | null {
    if (!value) return null

    try {
      let date: DateTime

      // If already a DateTime object, use it directly
      if (value instanceof DateTime) {
        date = value
      } else if (typeof value === 'string') {
        // Try parsing as ISO date first
        date = DateTime.fromISO(value)

        // If invalid, try parsing as simple date string
        if (!date.isValid) {
          date = DateTime.fromFormat(value, 'yyyy-MM-dd')
        }
      } else {
        return null
      }

      // If still invalid, return null
      if (!date.isValid) {
        return null
      }

      return date.toFormat('MMM dd, yyyy')
    } catch (error) {
      console.error('Date formatting error:', error)
      return null
    }
  }

  /**
   * Transform Patient model to frontend format (camelCase)
   * Database uses snake_case, frontend uses camelCase
   * Used in: index, show, edit views
   */
  static toFrontend(patient: Patient) {
    const dateOfBirth = this.formatDate(patient.dateOfBirth)

    return {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth,
      gender: patient.gender,
      phone: patient.phone,
    }
  }

  /**
   * Transform array of Patient models to frontend format
   * Used in: index view
   */
  static toFrontendList(patients: Patient[]) {
    return patients.map((patient) => this.toFrontend(patient))
  }

  /**
   * Transform minimal patient data (for relationships)
   * Used in: requests and reports when showing patient info
   */
  static toMinimal(patient: Patient | null) {
    if (!patient) {
      return { firstName: '-', lastName: '-' }
    }

    return {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
    }
  }

  /**
   * Transform Patient model for edit form (snake_case, unformatted dates)
   * Form fields must match validator field names
   * Used in: edit view
   */
  static toEditForm(patient: Patient) {
    return {
      id: patient.id,
      first_name: patient.firstName,
      last_name: patient.lastName,
      date_of_birth: patient.dateOfBirth ? patient.dateOfBirth.toISODate() : null,
      gender: patient.gender,
      phone: patient.phone,
    }
  }

  /**
   * Get patient full name
   * Used in: dropdowns and display
   */
  static getFullName(patient: Patient) {
    return `${patient.firstName} ${patient.lastName}`
  }
}
