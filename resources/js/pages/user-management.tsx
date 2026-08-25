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
    Trash2,
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
import InputError from '@/components/input-error';
import { dashboard } from '@/routes';

type UserRow = {
    id: number;
    name: string;
    email: string;
    status: string;
    createdAt: string | null;
};

const pageSizeOptions = [10, 20, 30, 40, 50];

function statusClass(status: string) {
    return status === 'Verified'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
        : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300';
}

function UserFormDialog({
    user,
    onOpenChange,
}: {
    user?: UserRow | null;
    onOpenChange?: (open: boolean) => void;
}) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(user?.name ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const isEdit = Boolean(user);

    useEffect(() => {
        if (!user) {
            return;
        }

        setName(user.name);
        setEmail(user.email);
        setPassword('');
        setErrors({});
    }, [user]);

    function handleOpenChange(nextOpen: boolean) {
        if (onOpenChange) {
            onOpenChange(nextOpen);
            return;
        }

        setOpen(nextOpen);

        if (nextOpen) {
            setName('');
            setEmail('');
            setPassword('');
            setErrors({});
        }
    }

    function handleSubmit() {
        setSaving(true);
        setErrors({});

        const payload = {
            name: name.trim(),
            email: email.trim(),
            password,
        };

        const options = {
            preserveScroll: true,
            onSuccess: () => handleOpenChange(false),
            onError: (validationErrors: Record<string, string>) =>
                setErrors(validationErrors),
            onFinish: () => setSaving(false),
        };

        if (user) {
            router.patch(
                `/dashboard/user-management/${user.id}`,
                payload,
                options,
            );
            return;
        }

        router.post('/dashboard/user-management', payload, options);
    }

    const dialog = (
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>
                    {isEdit ? 'Edit User' : 'Tambah User'}
                </DialogTitle>
                <DialogDescription>
                    {isEdit
                        ? 'Perbarui nama, email, atau password user.'
                        : 'Tambahkan user baru ke sistem.'}
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Nama</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Nama user"
                    />
                    <InputError message={errors.name} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="email@example.com"
                    />
                    <InputError message={errors.email} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">
                        Password {isEdit && '(kosongkan jika tidak diganti)'}
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Minimal 8 karakter"
                    />
                    <InputError message={errors.password} />
                </div>
            </div>
            <DialogFooter>
                <Button
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                >
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
            <Dialog open={Boolean(user)} onOpenChange={handleOpenChange}>
                {dialog}
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="shrink-0">
                    <Plus />
                    Tambah User
                </Button>
            </DialogTrigger>
            {dialog}
        </Dialog>
    );
}

function UserViewDialog({
    user,
    onOpenChange,
}: {
    user: UserRow | null;
    onOpenChange: (open: boolean) => void;
}) {
    return (
        <Dialog open={Boolean(user)} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Detail User</DialogTitle>
                    <DialogDescription>
                        Informasi user yang terdaftar.
                    </DialogDescription>
                </DialogHeader>
                {user && (
                    <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 text-sm">
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Nama</span>
                            <span className="font-medium">{user.name}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Email</span>
                            <span className="font-medium">{user.email}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">
                                Status
                            </span>
                            <Badge
                                variant="outline"
                                className={statusClass(user.status)}
                            >
                                {user.status}
                            </Badge>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">
                                Dibuat
                            </span>
                            <span className="font-medium">
                                {user.createdAt ?? '-'}
                            </span>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default function UserManagement({ users = [] }: { users: UserRow[] }) {
    const [search, setSearch] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);
    const [viewUser, setViewUser] = useState<UserRow | null>(null);
    const [editUser, setEditUser] = useState<UserRow | null>(null);
    const [deleteUser, setDeleteUser] = useState<UserRow | null>(null);

    const filteredUsers = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return users;
        }

        return users.filter((user) =>
            [user.name, user.email, user.status, user.createdAt ?? '']
                .join(' ')
                .toLowerCase()
                .includes(keyword),
        );
    }, [search, users]);

    const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
    const currentPage = Math.min(pageIndex, pageCount - 1);
    const startIndex = currentPage * pageSize;
    const visibleUsers = filteredUsers.slice(startIndex, startIndex + pageSize);
    const from = filteredUsers.length === 0 ? 0 : startIndex + 1;
    const to = Math.min(startIndex + pageSize, filteredUsers.length);

    function handleSearch(value: string) {
        setSearch(value);
        setPageIndex(0);
    }

    function handlePageSize(value: string) {
        setPageSize(Number(value));
        setPageIndex(0);
    }

    function handleDelete() {
        if (!deleteUser) {
            return;
        }

        router.delete(`/dashboard/user-management/${deleteUser.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteUser(null),
        });
    }

    return (
        <>
            <Head title="User Management" />
            <UserViewDialog
                user={viewUser}
                onOpenChange={(open) => !open && setViewUser(null)}
            />
            <UserFormDialog
                user={editUser}
                onOpenChange={(open) => !open && setEditUser(null)}
            />
            <Dialog
                open={Boolean(deleteUser)}
                onOpenChange={(open) => !open && setDeleteUser(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Hapus User</DialogTitle>
                        <DialogDescription>
                            User {deleteUser?.name} akan dihapus dari sistem.
                            Tindakan ini tidak bisa dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteUser(null)}
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
                    <h1 className="text-2xl font-semibold">User Management</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Kelola user yang dapat mengakses dashboard.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(event) =>
                                handleSearch(event.target.value)
                            }
                            placeholder="Cari user..."
                            className="pl-9"
                        />
                    </div>
                    <UserFormDialog />
                </div>

                <div className="overflow-hidden rounded-lg border bg-card">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Dibuat</TableHead>
                                <TableHead className="w-12" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visibleUsers.length > 0 ? (
                                visibleUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            {user.name}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={statusClass(
                                                    user.status,
                                                )}
                                            >
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {user.createdAt ?? '-'}
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
                                                            setViewUser(user)
                                                        }
                                                    >
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setEditUser(user)
                                                        }
                                                    >
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() =>
                                                            setDeleteUser(user)
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
                                        colSpan={5}
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
                        Menampilkan {from} - {to} dari {filteredUsers.length}{' '}
                        data
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2">
                            <Label
                                htmlFor="users-per-page"
                                className="text-sm font-medium text-foreground"
                            >
                                Data per halaman
                            </Label>
                            <Select
                                value={`${pageSize}`}
                                onValueChange={handlePageSize}
                            >
                                <SelectTrigger
                                    id="users-per-page"
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
                            <span className="text-sm font-medium whitespace-nowrap text-foreground">
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

UserManagement.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'User Management',
            href: '/dashboard/user-management',
        },
    ],
};
