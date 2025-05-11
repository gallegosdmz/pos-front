import { Ceo } from './types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CeoTableProps {
  ceos: Ceo[];
  isLoading: boolean;
  onDelete: (id: number) => void;
  onEdit?: (ceo: Ceo) => void; // Para futura edición
  businesses: { id: number; name: string }[];
}

export function CeoTable({ ceos, isLoading, onDelete, onEdit, businesses = [] }: CeoTableProps) {
  const getBusinessName = (businessId: number) => {
    const business = businesses.find(b => b.id === businessId);
    return business ? business.name : 'Sin negocio';
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead>Negocio</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">Cargando...</TableCell>
          </TableRow>
        ) : ceos.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">No hay CEOs registrados</TableCell>
          </TableRow>
        ) : (
          ceos.map((ceo, idx) => (
            <TableRow key={ceo.id ?? idx}>
              <TableCell>{ceo.id}</TableCell>
              <TableCell>{ceo.name}</TableCell>
              <TableCell>{ceo.userName}</TableCell>
              <TableCell>{getBusinessName(Number(ceo.businessId))}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => { console.log('Click editar en tabla:', ceo); onEdit?.(ceo); }}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(ceo.id)}>
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