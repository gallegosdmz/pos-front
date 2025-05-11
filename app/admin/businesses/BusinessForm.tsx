import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BusinessFormValues } from './types';

interface BusinessFormProps {
  formData: BusinessFormValues;
  errors?: { [key: string]: string[] };
  onChange: (field: keyof BusinessFormValues, value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function BusinessForm({ formData, errors = {}, onChange, onSubmit, isLoading }: BusinessFormProps) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
      className="grid gap-4 py-4"
    >
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Nombre del Negocio</Label>
        <div className="col-span-3 space-y-2">
          <Input
            id="name"
            value={formData.name}
            onChange={e => onChange('name', e.target.value)}
            placeholder="Nombre del negocio"
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
        <Label htmlFor="email" className="text-right">Email del Negocio</Label>
        <div className="col-span-3 space-y-2">
          <Input
            id="email"
            value={formData.email}
            onChange={e => onChange('email', e.target.value)}
            placeholder="Email del negocio"
            className={errors.email?.length ? 'border-red-500' : ''}
            required
          />
          {errors.email?.length > 0 && (
            <p className="text-sm text-red-500">{errors.email.join(", ")}</p>
          )}
        </div>
      </div>
    </form>
  );
} 