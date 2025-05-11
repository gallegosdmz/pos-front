import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CeoFormValues } from './types';
import { Business } from '../businesses/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CeoFormProps {
  formData: CeoFormValues;
  errors?: { [key: string]: string[] };
  onChange: (field: keyof CeoFormValues, value: string | number) => void;
  onSubmit: () => void;
  isLoading: boolean;
  businesses: Business[];
}

export function CeoForm({ formData, errors = {}, onChange, onSubmit, isLoading, businesses }: CeoFormProps) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
      className="grid gap-4 py-4"
    >
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Nombre del CEO</Label>
        <div className="col-span-3 space-y-2">
          <Input
            id="name"
            value={formData.name}
            onChange={e => onChange('name', e.target.value)}
            placeholder="Nombre del CEO"
            className={errors.name?.length ? 'border-red-500' : ''}
            maxLength={90}
            required
          />
          {errors.name?.length > 0 && (
            <p className="text-sm text-red-500">{errors.name.join(", ")}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="userName" className="text-right">Usuario</Label>
        <div className="col-span-3 space-y-2">
          <Input
            id="userName"
            value={formData.userName}
            onChange={e => onChange('userName', e.target.value)}
            placeholder="Usuario del CEO"
            className={errors.userName?.length ? 'border-red-500' : ''}
            maxLength={90}
            required
          />
          {errors.userName?.length > 0 && (
            <p className="text-sm text-red-500">{errors.userName.join(", ")}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="password" className="text-right">Contraseña</Label>
        <div className="col-span-3 space-y-2">
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={e => onChange('password', e.target.value)}
            placeholder="Contraseña del CEO"
            className={errors.password?.length ? 'border-red-500' : ''}
            minLength={6}
            required
          />
          {errors.password?.length > 0 && (
            <p className="text-sm text-red-500">{errors.password.join(", ")}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="businessId" className="text-right">Negocio</Label>
        <div className="col-span-3 space-y-2">
          <Select
            value={formData.businessId ? String(formData.businessId) : ''}
            onValueChange={val => onChange('businessId', Number(val))}
            required
          >
            <SelectTrigger id="businessId">
              <SelectValue placeholder="Selecciona un negocio" />
            </SelectTrigger>
            <SelectContent>
              {businesses.map(b => (
                <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.businessId?.length > 0 && (
            <p className="text-sm text-red-500">{errors.businessId.join(", ")}</p>
          )}
        </div>
      </div>
    </form>
  );
} 