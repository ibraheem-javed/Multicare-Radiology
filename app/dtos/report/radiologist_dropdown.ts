export type RadiologistDropdown = {
  id: string
  name: string
}

export function toRadiologistDropdown(user: any): RadiologistDropdown {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
  }
}

export function toRadiologistDropdownList(users: any[]) {
  return users.map(toRadiologistDropdown)
}
