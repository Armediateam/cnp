import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    MoreVertical,
    Plus,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';

type HomepageCardRow = {
    id: number;
    title: string;
    image_path: string;
    url: string;
    order: number;
    is_active: boolean;
};

export default function HomepageSettings({ cards }: { cards: HomepageCardRow[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<HomepageCardRow | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
        url: '',
        order: 0,
        is_active: true,
        image: null as File | null,
    });

    const openCreate = () => {
        reset();
        clearErrors();
        setIsCreateOpen(true);
    };

    const openEdit = (card: HomepageCardRow) => {
        reset();
        clearErrors();
        setSelectedCard(card);
        setData({
            title: card.title,
            url: card.url,
            order: card.order,
            is_active: card.is_active,
            image: null,
        });
        setIsEditOpen(true);
    };

    const openDelete = (card: HomepageCardRow) => {
        setSelectedCard(card);
        setIsDeleteOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/homepage-settings', {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCard) return;

        post(`/dashboard/homepage-settings/${selectedCard.id}`, {
            onSuccess: () => {
                setIsEditOpen(false);
                reset();
            },
        });
    };

    const submitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCard) return;

        router.delete(`/dashboard/homepage-settings/${selectedCard.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
            },
        });
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            <Head title="Pengaturan Beranda" />
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="grid gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Pengaturan Beranda
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola kartu konten yang tampil di halaman beranda.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 size-4" />
                        Tambah Kartu
                    </Button>
                </div>
            </div>

            <div className="rounded-md border bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Gambar</TableHead>
                            <TableHead>Judul</TableHead>
                            <TableHead>URL Tujuan</TableHead>
                            <TableHead>Urutan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cards.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    Belum ada data.
                                </TableCell>
                            </TableRow>
                        ) : (
                            cards.map((card) => (
                                <TableRow key={card.id}>
                                    <TableCell>
                                        <img
                                            src={`/storage/${card.image_path}`}
                                            alt={card.title}
                                            className="h-10 w-16 rounded object-cover"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {card.title}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {card.url}
                                    </TableCell>
                                    <TableCell>{card.order}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={
                                                card.is_active
                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                    : 'border-slate-200 bg-slate-50 text-slate-700'
                                            }
                                        >
                                            {card.is_active ? 'Aktif' : 'Tidak Aktif'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8"
                                                >
                                                    <MoreVertical className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => openEdit(card)}
                                                >
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:bg-red-50 focus:text-red-700"
                                                    onClick={() => openDelete(card)}
                                                >
                                                    Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Kartu Beranda</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Judul</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="url">URL Tujuan</Label>
                            <Input
                                id="url"
                                value={data.url}
                                onChange={(e) => setData('url', e.target.value)}
                                placeholder="/rumah-citra-nusantara"
                                required
                            />
                            {errors.url && (
                                <p className="text-sm text-red-500">{errors.url}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="order">Urutan</Label>
                            <Input
                                id="order"
                                type="number"
                                value={data.order}
                                onChange={(e) => setData('order', Number(e.target.value))}
                                required
                            />
                            {errors.order && (
                                <p className="text-sm text-red-500">{errors.order}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="image">Gambar</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData('image', e.target.files ? e.target.files[0] : null)
                                }
                                required
                            />
                            {errors.image && (
                                <p className="text-sm text-red-500">{errors.image}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="size-4 rounded border-gray-300"
                            />
                            <Label htmlFor="is_active">Aktif (Tampilkan di beranda)</Label>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Kartu Beranda</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-title">Judul</Label>
                            <Input
                                id="edit-title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-url">URL Tujuan</Label>
                            <Input
                                id="edit-url"
                                value={data.url}
                                onChange={(e) => setData('url', e.target.value)}
                                required
                            />
                            {errors.url && (
                                <p className="text-sm text-red-500">{errors.url}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-order">Urutan</Label>
                            <Input
                                id="edit-order"
                                type="number"
                                value={data.order}
                                onChange={(e) => setData('order', Number(e.target.value))}
                                required
                            />
                            {errors.order && (
                                <p className="text-sm text-red-500">{errors.order}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-image">Gambar (Opsional)</Label>
                            <Input
                                id="edit-image"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData('image', e.target.files ? e.target.files[0] : null)
                                }
                            />
                            <p className="text-xs text-muted-foreground">
                                Biarkan kosong jika tidak ingin mengubah gambar.
                            </p>
                            {errors.image && (
                                <p className="text-sm text-red-500">{errors.image}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="edit-is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="size-4 rounded border-gray-300"
                            />
                            <Label htmlFor="edit-is_active">Aktif (Tampilkan di beranda)</Label>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Simpan Perubahan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Kartu</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>
                            Apakah Anda yakin ingin menghapus kartu{' '}
                            <strong>{selectedCard?.title}</strong>? Aksi ini tidak dapat dibatalkan.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={submitDelete}>
                            Ya, Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

HomepageSettings.layout = dashboard;
