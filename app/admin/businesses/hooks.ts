import { useState, useCallback } from 'react';
import { Business, BusinessFormValues } from './types';
import { BusinessService } from './service';
import { useToast } from '@/components/ui/use-toast';

export const useBusinesses = () => {
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadBusinesses = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await BusinessService.getBusinesses();
      setBusinesses(data);
    } catch (error: any) {
      toast({
        title: 'Error al cargar negocios',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const createBusiness = useCallback(async (formData: BusinessFormValues) => {
    try {
      setIsLoading(true);
      const business = await BusinessService.createBusiness(formData);
      setBusinesses(prev => [...prev, business]);
      toast({
        title: 'Negocio creado',
        description: 'El negocio fue creado exitosamente.',
        variant: 'default',
      });
      return business;
    } catch (error: any) {
      toast({
        title: 'Error al crear negocio',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateBusiness = useCallback(async (id: number, formData: BusinessFormValues) => {
    try {
      setIsLoading(true);
      const updated = await BusinessService.updateBusiness(id, formData);
      setBusinesses(prev => prev.map(b => b.id === id ? updated : b));
      toast({
        title: 'Negocio actualizado',
        description: 'El negocio fue actualizado exitosamente.',
        variant: 'default',
      });
      return updated;
    } catch (error: any) {
      toast({
        title: 'Error al actualizar negocio',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const deleteBusiness = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      await BusinessService.deleteBusiness(id);
      setBusinesses(prev => prev.filter(b => b.id !== id));
      toast({
        title: 'Negocio eliminado',
        description: 'El negocio fue eliminado exitosamente.',
        variant: 'default',
      });
    } catch (error: any) {
      toast({
        title: 'Error al eliminar negocio',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    businesses,
    isLoading,
    loadBusinesses,
    createBusiness,
    updateBusiness,
    deleteBusiness,
  };
}; 