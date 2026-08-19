import { Head, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    MoreVertical,
    Plus,
    Search,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';

type MasterDataRow = {
    id: number;
    category: string;
    name: string;
    value: number | null;
    unit: string | null;
    status: string;
    createdAt: string | null;
};

const categories = [
    {
        value: 'structure_specification',
        label: 'Spesifikasi Struktur',
        description: 'Pilihan sloof, kolom, dan ring balk.',
    },
    {
        value: 'request_cost',
        label: 'Biaya Request',
        description: 'Katalog item tambahan sesuai permintaan konsumen.',
    },
    {
        value: 'finishing_cost',
        label: 'Biaya Finishing',
        description: 'Katalog pekerjaan finishing rumah.',
    },
    {
        value: 'building_price',
        label: 'Harga Bangunan',
        description: 'Harga dasar pembangunan per meter persegi.',
    },
    {
        value: 'region',
        label: 'Wilayah',
        description: 'Daftar desa atau area project.',
    },
];

const pageSizeOptions = [10, 20, 30, 40, 50];
const statusOptions = ['Active', 'Inactive'];

function categoryLabel(value: string) {
    return categories.find((category) => category.value === value)?.label ?? value;
}

function statusClass(status: string) {
    return status === 'Active'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
        : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300';
}

function formatValue(item: MasterDataRow) {
    if (item.value === null) {
        return '-';
    }

    if (item.category === 'building_price' || item.category.endsWith('_cost')) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(item.value);
    }

    return new Intl.NumberFormat('id-ID').format(item.value);
}

function MasterDataFormDialog({
    category,
    item,
    onOpenChange,
}: {
    category: string;
    item?: MasterDataRow | null;
    onOpenChange?: (open: boolean) => void;
}) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(item?.name ?? '');
    const [value, setValue] = useState(item?.value?.toString() ?? '');
    const [unit, setUnit] = useState(item?.unit ?? '');
    const [status, setStatus] = useState(item?.status ?? 'Active');
    const [saving, setSaving] = useState(false);
    const isEdit = Boolean(item);
    const activeCategory = item?.category ?? category;

    useEffect(() => {
        if (!item) {
            return;
        }

        setName(item.name);
        setValue(item.value?.toString() ?? '');
        setUnit(item.unit ?? '');
        setStatus(item.status);
    }, [item]);

    function resetForm() {
        setName('');
        setValue('');
        setUnit('');
        setStatus('Active');
    }

    function handleOpenChange(nextOpen: boolean) {
        if (onOpenChange) {
            onOpenChange(nextOpen);
            return;
        }

        setOpen(nextOpen);

        if (nextOpen) {
            resetForm();
        }
    }

    function handleSubmit() {
        setSaving(true);

        const payload = {
            category: activeCategory,
            name: name.trim(),
            value: value === '' ? null : Number(value),
            unit: unit.trim() || null,
            status,
        };

        const options = {
            preserveScroll: true,
            onSuccess: () => handleOpenChange(false),
            onFinish: () => setSaving(false),
        };

        if (item) {
            router.patch(`/dashboard/master-data/${item.id}`, payload, options);
            return;
        }

        router.post('/dashboard/master-data', payload, options);
    }

    const dialog = (
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>
                    {isEdit ? 'Edit Master Data' : 'Tambah Master Data'}
                </DialogTitle>
                <DialogDescription>
                    {categoryLabel(activeCategory)} digunakan sebagai referensi
                    saat membuat RAB project.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label>Kategori</Label>
                    <Input value={categoryLabel(activeCategory)} disabled />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="master-name">Nama</Label>
                    <Input
                        id="master-name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Nama master data"
                    />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="master-value">Nilai / Harga</Label>
                        <Input
                            id="master-value"
                            type="number"
                            min="0"
                            value={value}
                            onChange={(event) => setValue(event.target.value)}
                            placeholder="0"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="master-unit">Satuan</Label>
                        <Input
                            id="master-unit"
                            value={unit}
                            onChange={(event) => setUnit(event.target.value)}
                            placeholder="m2, item, desa"
                        />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => handleOpenChange(false)}>
                    Batal
                </Button>
                <Button disabled={saving} onClick={handleSubmit}>
                    Simpan
                </Button>
            </DialogFooter>
        </DialogContent>
    );

    if (onOpenChange) {
        return (
            <Dialog open={Boolean(item)} onOpenChange={handleOpenChange}>
                {dialog}
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="shrink-0">
                    <Plus />
                    Tambah Data
                </Button>
            </DialogTrigger>
            {dialog}
        </Dialog>
    );
}

export default function MasterData({
    items = [],
}: {
    items: MasterDataRow[];
}) {
    const [activeCategory, setActiveCategory] = useState(categories[0].value);
    const [search, setSearch] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);
    const [editItem, setEditItem] = useState<MasterDataRow | null>(null);
    const [deleteItem, setDeleteItem] = useState<MasterDataRow | null>(null);

    const activeCategoryMeta = categories.find(
        (category) => category.value === activeCategory,
    );

    const filteredItems = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return items
            .filter((item) => item.category === activeCategory)
            .filter((item) => {
                if (!keyword) {
                    return true;
                }

                return [
                    item.name,
                    item.unit ?? '',
                    item.status,
                    formatValue(item),
                    item.createdAt ?? '',
                ]
                    .join(' ')
                    .toLowerCase()
                    .includes(keyword);
            });
    }, [activeCategory, items, search]);

    const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize));
    const currentPage = Math.min(pageIndex, pageCount - 1);
    const startIndex = currentPage * pageSize;
    const visibleItems = filteredItems.slice(startIndex, startIndex + pageSize);
    const from = filteredItems.length === 0 ? 0 : startIndex + 1;
    const to = Math.min(startIndex + pageSize, filteredItems.length);

    function handleCategoryChange(category: string) {
        setActiveCategory(category);
        setSearch('');
        setPageIndex(0);
    }

    function handleSearch(value: string) {
        setSearch(value);
        setPageIndex(0);
    }

    function handlePageSize(value: string) {
        setPageSize(Number(value));
        setPageIndex(0);
    }

    function handleDelete() {
        if (!deleteItem) {
            return;
        }

        router.delete(`/dashboard/master-data/${deleteItem.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteItem(null),
        });
    }

    return (
        <>
            <Head title="Master Data" />
            <MasterDataFormDialog
                category={activeCategory}
                item={editItem}
                onOpenChange={(open) => !open && setEditItem(null)}
            />
            <Dialog
                open={Boolean(deleteItem)}
                onOpenChange={(open) => !open && setDeleteItem(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Hapus Master Data</DialogTitle>
                        <DialogDescription>
                            Data {deleteItem?.name} akan dihapus dari sistem.
                            Tindakan ini tidak bisa dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteItem(null)}
                        >
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className="flex flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Master Data</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Kelola referensi yang dipakai dalam pembuatan RAB.
                    </p>
                </div>

                <div className="grid gap-2 rounded-lg border bg-card p-2 lg:grid-cols-5">
                    {categories.map((category) => (
                        <button
                            key={category.value}
                            type="button"
                            onClick={() => handleCategoryChange(category.value)}
                            className={`rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                                activeCategory === category.value
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-transparent hover:bg-muted'
                            }`}
                        >
                            <span className="block font-medium">
                                {category.label}
                            </span>
                            <span className="mt-1 block text-xs opacity-80">
                                {
                                    items.filter(
                                        (item) =>
                                            item.category === category.value,
                                    ).length
                                }{' '}
                                data
                            </span>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">
                            {activeCategoryMeta?.label}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {activeCategoryMeta?.description}
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(event) =>
                                    handleSearch(event.target.value)
                                }
                                placeholder="Cari master data..."
                                className="pl-9"
                            />
                        </div>
                        <MasterDataFormDialog category={activeCategory} />
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border bg-card">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Nilai / Harga</TableHead>
                                <TableHead>Satuan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Dibuat</TableHead>
                                <TableHead className="w-12" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visibleItems.length > 0 ? (
                                visibleItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {item.name}
                                        </TableCell>
                                        <TableCell>{formatValue(item)}</TableCell>
                                        <TableCell>{item.unit ?? '-'}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={statusClass(
                                                    item.status,
                                                )}
                                            >
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {item.createdAt ?? '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-muted-foreground"
                                                    >
                                                        <MoreVertical />
                                                        <span className="sr-only">
                                                            Buka menu
                                                        </span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-36"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setEditItem(item)
                                                        }
                                                    >
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() =>
                                                            setDeleteItem(item)
                                                        }
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        Tidak ada data.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex flex-col gap-4 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        Menampilkan {from} - {to} dari {filteredItems.length}{' '}
                        data
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2">
                            <Label
                                htmlFor="master-per-page"
                                className="text-sm font-medium text-foreground"
                            >
                                Data per halaman
                            </Label>
                            <Select
                                value={`${pageSize}`}
                                onValueChange={handlePageSize}
                            >
                                <SelectTrigger
                                    id="master-per-page"
                                    size="sm"
                                    className="w-20"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {pageSizeOptions.map((option) => (
                                        <SelectItem
                                            key={option}
                                            value={`${option}`}
                                        >
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="whitespace-nowrap text-sm font-medium text-foreground">
                                Halaman {currentPage + 1} dari {pageCount}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="hidden size-8 lg:inline-flex"
                                disabled={currentPage === 0}
                                onClick={() => setPageIndex(0)}
                            >
                                <ChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                disabled={currentPage === 0}
                                onClick={() =>
                                    setPageIndex((page) =>
                                        Math.max(page - 1, 0),
                                    )
                                }
                            >
                                <ChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                disabled={currentPage >= pageCount - 1}
                                onClick={() =>
                                    setPageIndex((page) =>
                                        Math.min(page + 1, pageCount - 1),
                                    )
                                }
                            >
                                <ChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="hidden size-8 lg:inline-flex"
                                disabled={currentPage >= pageCount - 1}
                                onClick={() => setPageIndex(pageCount - 1)}
                            >
                                <ChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

MasterData.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Master Data',
            href: '/dashboard/master-data',
        },
    ],
};
