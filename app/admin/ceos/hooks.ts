import { useState, useCallback, useEffect } from 'react';
import { Ceo, CeoFormValues } from './types';
import { CeoService } from './service';
import { useToast } from '@/components/ui/use-toast';
import { Business } from '../businesses/types';

export const useCeos = () => {
  const { toast } = useToast();
  const [ceos, setCeos] = useState<Ceo[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCeos = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await CeoService.getCeos();
      setCeos(data);
    } catch (error: any) {
      toast({
        title: 'Error al cargar CEOs',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const loadBusinesses = useCallback(async () => {
    try {
      const data = await CeoService.getBusinesses();
      setBusinesses(data);
    } catch (error: any) {
      toast({
        title: 'Error al cargar negocios',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [toast]);

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  const createCeo = useCallback(async (formData: CeoFormValues) => {
    try {
      setIsLoading(true);
      await CeoService.createCeo(formData);
      await loadCeos();
      toast({
        title: 'CEO creado',
        description: 'El CEO fue creado exitosamente.',
        variant: 'default',
      });
    } catch (error: any) {
      toast({
        title: 'Error al crear CEO',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast, loadCeos]);

  const deleteCeo = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      await CeoService.deleteCeo(id);
      await loadCeos();
      toast({
        title: 'CEO eliminado',
        description: 'El CEO fue eliminado exitosamente.',
        variant: 'default',
      });
    } catch (error: any) {
      toast({
        title: 'Error al eliminar CEO',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast, loadCeos]);

  const editCeo = useCallback(async (id: number, formData: Partial<CeoFormValues>) => {
    try {
      setIsLoading(true);
      await CeoService.editCeo(id, formData);
      await loadCeos();
      toast({
        title: 'CEO editado',
        description: 'El CEO fue editado exitosamente.',
        variant: 'default',
      });
    } catch (error: any) {
      toast({
        title: 'Error al editar CEO',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast, loadCeos]);

  return {
    ceos,
    businesses,
    isLoading,
    loadCeos,
    createCeo,
    deleteCeo,
    editCeo,
  };
}; 