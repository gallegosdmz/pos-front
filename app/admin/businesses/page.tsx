"use client"

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useBusinesses } from './hooks';
import { BusinessForm } from './BusinessForm';
import { BusinessTable } from './BusinessTable';
import { BusinessFormValues, Business } from './types';
import { useCeos } from '../ceos/hooks';
import { CeoForm } from '../ceos/CeoForm';
import { CeoTable } from '../ceos/CeoTable';
import { CeoFormValues, Ceo } from '../ceos/types';
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog"

export default function AdminPanelPage() {
  // Negocios
  const { businesses, isLoading: isLoadingBusinesses, loadBusinesses, createBusiness, deleteBusiness, updateBusiness } = useBusinesses();
  const [businessFormData, setBusinessFormData] = useState<BusinessFormValues>({ name: '', email: '' });
  const [isBusinessDialogOpen, setIsBusinessDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBusinessId, setEditingBusinessId] = useState<number | null>(null);

  // CEOs
  const { ceos, businesses: ceoBusinesses, isLoading: isLoadingCeos, loadCeos, createCeo, deleteCeo, editCeo } = useCeos();
  const [ceoFormData, setCeoFormData] = useState<CeoFormValues>({ name: '', userName: '', password: '', businessId: '' });
  const [isCeoDialogOpen, setIsCeoDialogOpen] = useState(false);
  const [isEditCeoDialogOpen, setIsEditCeoDialogOpen] = useState(false);
  const [editingCeo, setEditingCeo] = useState<Ceo | null>(null);

  // Estados para diálogos de eliminación
  const [isDeleteBusinessDialogOpen, setIsDeleteBusinessDialogOpen] = useState(false)
  const [deletingBusinessId, setDeletingBusinessId] = useState<number | null>(null)
  const [isDeleteCeoDialogOpen, setIsDeleteCeoDialogOpen] = useState(false)
  const [deletingCeoId, setDeletingCeoId] = useState<number | null>(null)

  useEffect(() => {
    loadBusinesses();
    loadCeos();
  }, [loadBusinesses, loadCeos]);

  // Handlers negocios
  const handleBusinessChange = (field: keyof BusinessFormValues, value: string) => {
    setBusinessFormData(prev => ({ ...prev, [field]: value }));
  };
  const handleBusinessSubmit = async () => {
    if (isEditMode && editingBusinessId !== null) {
      await updateBusiness(editingBusinessId, businessFormData);
    } else {
      await createBusiness(businessFormData);
    }
    setBusinessFormData({ name: '', email: '' });
    setIsBusinessDialogOpen(false);
    setIsEditMode(false);
    setEditingBusinessId(null);
  };
  const handleDeleteBusiness = async (id: number) => {
    await deleteBusiness(id);
  };
  const handleEditBusiness = (business: Business) => {
    setBusinessFormData({ name: business.name, email: business.email });
    setEditingBusinessId(business.id);
    setIsEditMode(true);
    setIsBusinessDialogOpen(true);
  };

  // Handlers CEOs
  const handleCeoChange = (field: keyof CeoFormValues, value: string | number) => {
    setCeoFormData(prev => ({ ...prev, [field]: value }));
  };
  const handleCeoSubmit = async () => {
    await createCeo(ceoFormData);
    setCeoFormData({ name: '', userName: '', password: '', businessId: '' });
    setIsCeoDialogOpen(false);
  };
  const handleDeleteCeo = async (id: number) => {
    await deleteCeo(id);
  };
  const handleEditCeo = (ceo: Ceo) => {
    setEditingCeo(ceo);
    setCeoFormData({
      name: ceo.name,
      userName: ceo.userName,
      password: '',
      businessId: ceo.business?.id ?? ceo.businessId ?? '',
    });
    setIsEditCeoDialogOpen(true);
  };
  const handleEditCeoSubmit = async () => {
    if (editingCeo) {
      await editCeo(editingCeo.id, ceoFormData);
      setIsEditCeoDialogOpen(false);
      setEditingCeo(null);
      setCeoFormData({ name: '', userName: '', password: '', businessId: '' });
    }
  };

  const handleAskDeleteBusiness = (id: number) => {
    setDeletingBusinessId(id)
    setIsDeleteBusinessDialogOpen(true)
  }
  const handleConfirmDeleteBusiness = async () => {
    if (deletingBusinessId !== null) {
      await handleDeleteBusiness(deletingBusinessId)
      setIsDeleteBusinessDialogOpen(false)
      setDeletingBusinessId(null)
    }
  }
  const handleAskDeleteCeo = (id: number) => {
    setDeletingCeoId(id)
    setIsDeleteCeoDialogOpen(true)
  }
  const handleConfirmDeleteCeo = async () => {
    if (deletingCeoId !== null) {
      await handleDeleteCeo(deletingCeoId)
      setIsDeleteCeoDialogOpen(false)
      setDeletingCeoId(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-2 md:px-0">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Administración de Negocios y CEOs</h1>
      <p className="text-muted-foreground mb-8">Administra los negocios y CEOs registrados en el sistema. Solo visible para administradores.</p>
      <Tabs defaultValue="ceos" className="mt-6">
        <TabsList>
          <TabsTrigger value="ceos">CEOs</TabsTrigger>
          <TabsTrigger value="businesses">Negocios</TabsTrigger>
        </TabsList>
        <TabsContent value="ceos" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setIsCeoDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Añadir nuevo CEO
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Lista de CEOs</CardTitle>
              <CardDescription>Total de CEOs: {ceos.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <CeoTable
                ceos={ceos}
                isLoading={isLoadingCeos}
                onDelete={handleAskDeleteCeo}
                onEdit={handleEditCeo}
                businesses={ceoBusinesses}
              />
            </CardContent>
          </Card>
          <Dialog open={isCeoDialogOpen} onOpenChange={setIsCeoDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear nuevo CEO</DialogTitle>
              </DialogHeader>
              <CeoForm
                formData={ceoFormData}
                onChange={handleCeoChange}
                onSubmit={handleCeoSubmit}
                isLoading={isLoadingCeos}
                businesses={ceoBusinesses}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCeoDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleCeoSubmit} disabled={isLoadingCeos}>
                  {isLoadingCeos ? 'Guardando...' : 'Guardar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditCeoDialogOpen} onOpenChange={setIsEditCeoDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar CEO</DialogTitle>
              </DialogHeader>
              <CeoForm
                formData={ceoFormData}
                onChange={handleCeoChange}
                onSubmit={handleEditCeoSubmit}
                isLoading={isLoadingCeos}
                businesses={ceoBusinesses}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditCeoDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleEditCeoSubmit} disabled={isLoadingCeos}>
                  {isLoadingCeos ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        <TabsContent value="businesses" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => {
              setIsBusinessDialogOpen(true);
              setIsEditMode(false);
              setBusinessFormData({ name: '', email: '' });
              setEditingBusinessId(null);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Añadir nuevo negocio
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Lista de Negocios</CardTitle>
              <CardDescription>Total de negocios: {businesses.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <BusinessTable businesses={businesses} isLoading={isLoadingBusinesses} onDelete={handleAskDeleteBusiness} onEdit={handleEditBusiness} />
            </CardContent>
          </Card>
          <Dialog open={isBusinessDialogOpen} onOpenChange={(open) => {
            setIsBusinessDialogOpen(open);
            if (!open) {
              setIsEditMode(false);
              setBusinessFormData({ name: '', email: '' });
              setEditingBusinessId(null);
            }
          }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditMode ? 'Editar negocio' : 'Crear nuevo negocio'}</DialogTitle>
              </DialogHeader>
              <BusinessForm
                formData={businessFormData}
                onChange={handleBusinessChange}
                onSubmit={handleBusinessSubmit}
                isLoading={isLoadingBusinesses}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsBusinessDialogOpen(false);
                  setIsEditMode(false);
                  setBusinessFormData({ name: '', email: '' });
                  setEditingBusinessId(null);
                }}>Cancelar</Button>
                <Button onClick={handleBusinessSubmit} disabled={isLoadingBusinesses}>
                  {isLoadingBusinesses ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Guardar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
      <DeleteConfirmDialog
        open={isDeleteBusinessDialogOpen}
        onOpenChange={setIsDeleteBusinessDialogOpen}
        onConfirm={handleConfirmDeleteBusiness}
        title="¿Eliminar negocio?"
        description="Esta acción eliminará el negocio permanentemente."
        confirmText="Eliminar negocio"
      />
      <DeleteConfirmDialog
        open={isDeleteCeoDialogOpen}
        onOpenChange={setIsDeleteCeoDialogOpen}
        onConfirm={handleConfirmDeleteCeo}
        title="¿Eliminar CEO?"
        description="Esta acción eliminará el CEO permanentemente."
        confirmText="Eliminar CEO"
      />
    </div>
  );
} 