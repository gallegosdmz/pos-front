import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Key } from "lucide-react"
import { Employee } from "./types"

interface EmployeeTableProps {
  employees: Employee[]
  isLoading: boolean
  openEditDialog: (employee: Employee) => void
  handleDeleteEmployee: (id: string) => void
  handleChangePassword: (employee: Employee) => void
}

export function EmployeeTable({ employees, isLoading, openEditDialog, handleDeleteEmployee, handleChangePassword }: EmployeeTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              {isLoading ? "Cargando..." : "No se encontraron empleados"}
            </TableCell>
          </TableRow>
        ) : (
          employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell>{employee.userName}</TableCell>
              <TableCell>{employee.role}</TableCell>
              <TableCell>
                <Badge variant={!employee.isDeleted ? "default" : "secondary"}>
                  {!employee.isDeleted ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(employee)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteEmployee(employee.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleChangePassword(employee)}
                  >
                    <Key className="h-4 w-4" />
                    <span className="sr-only">Cambiar contraseña</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
} 