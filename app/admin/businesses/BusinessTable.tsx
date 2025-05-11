import { Business } from './types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BusinessTableProps {
  businesses: Business[];
  isLoading: boolean;
  onDelete: (id: number) => void;
  onEdit?: (business: Business) => void; // Para futura edición
}

export function BusinessTable({ businesses, isLoading, onDelete, onEdit }: BusinessTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">Cargando...</TableCell>
          </TableRow>
        ) : businesses.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">No hay negocios registrados</TableCell>
          </TableRow>
        ) : (
          businesses.map((business, idx) => (
            <TableRow key={business.id ?? idx}>
              <TableCell>{business.id}</TableCell>
              <TableCell>{business.name}</TableCell>
              <TableCell>{business.email}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit?.(business)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(business.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
} 