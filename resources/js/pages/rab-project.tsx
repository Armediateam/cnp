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
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';

type RabProjectRow = {
    id: number;
    customer: string;
    village: string;
    area: string;
    total: number;
    status: string;
    length: number;
    width: number;
    buildingArea: number;
    pricePerMeter: number;
    buildingCost: number;
    specification: string | null;
    requestItems: Array<{ label: string; cost: number }>;
    requestItemsTotal: number;
    requestShippingCost: number;
    requestOtherCost: number;
    requestDpPercent: number;
    requestStartPercent: number;
    requestInstallments: number;
    finishingItems: Array<{ label: string; cost: number }>;
    finishingItemsTotal: number;
    finishingShippingCost: number;
    finishingOtherCost: number;
    finishingDpPercent: number;
    finishingInstallments: number;
};

type CostItem = {
    id: number;
    label: string;
    cost: number;
    custom?: boolean;
};

const pageSizeOptions = [10, 20, 30, 40, 50];
const statusOptions = ['Draft', 'Review', 'Deal', 'Batal'];
const rabSteps = [
    'Data & Biaya Pembangunan',
    'Biaya Request',
    'Biaya Finishing',
];

const requestCatalogItems = [
    'Atap model limas',
    'Kanopi',
    'Tandon air',
    'Pagar depan',
    'Carport',
    'Teras tambahan',
];

const finishingCatalogItems = [
    'KM/WC',
    'Plesteran luar dalam',
    'Acian luar dalam',
    'Pasang keramik',
    'Plafond luar dalam',
    'Instalasi listrik',
    'Pengecatan ex Nippon (putih)',
    'Septictank',
    'Perawatan & pembersihan',
];
const structureSpecifications = [
    'Besi S',
    'Besi M',
    'Besi L',
    '4D10 + Begel D8-15',
    '4D12 + Begel D8-15',
    '6D12 + Begel D8-15',
    'Custom',
];

function statusVariant(status: string) {
    switch (status) {
        case 'Deal':
            return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300';
        case 'Review':
            return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300';
        case 'Draft':
            return 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300';
        case 'Revisi':
            return 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300';
        default:
            return 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300';
    }
}

function formatRupiah(value: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);
}

function SummaryRow({
    label,
    value,
    strong = false,
}: {
    label: string;
    value: string;
    strong?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className={strong ? 'font-semibold' : 'text-sm font-medium'}>
                {value}
            </span>
        </div>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {children}
        </div>
    );
}

function CreateRabDialog() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);
    const [customer, setCustomer] = useState('');
    const [village, setVillage] = useState('');
    const [specification, setSpecification] = useState('');
    const [length, setLength] = useState(0);
    const [width, setWidth] = useState(0);
    const [pricePerMeter, setPricePerMeter] = useState(0);
    const [requestItems, setRequestItems] = useState<CostItem[]>([
        { id: 1, label: 'Atap model limas', cost: 0 },
    ]);
    const [requestShipping, setRequestShipping] = useState(0);
    const [requestOtherCost, setRequestOtherCost] = useState(0);
    const [requestDpPercent, setRequestDpPercent] = useState(0);
    const [requestStartPercent, setRequestStartPercent] = useState(0);
    const [requestInstallments, setRequestInstallments] = useState(0);
    const [finishingItems, setFinishingItems] = useState<CostItem[]>([]);
    const [finishingShipping, setFinishingShipping] = useState(0);
    const [finishingOtherCost, setFinishingOtherCost] = useState(0);
    const [finishingDpPercent, setFinishingDpPercent] = useState(0);
    const [finishingInstallments, setFinishingInstallments] = useState(0);

    const buildingArea = length * width;
    const buildingCost = buildingArea * pricePerMeter;
    const requestItemsTotal = requestItems.reduce(
        (total, item) => total + item.cost,
        0,
    );
    const nonFinishingTotal =
        buildingCost + requestItemsTotal + requestShipping + requestOtherCost;
    const requestDp = nonFinishingTotal * (requestDpPercent / 100);
    const requestStart =
        nonFinishingTotal * (requestStartPercent / 100);
    const requestWeeklyTotal = Math.max(
        nonFinishingTotal - requestDp - requestStart,
        0,
    );
    const requestWeekly =
        requestInstallments > 0 ? requestWeeklyTotal / requestInstallments : 0;
    const finishingItemsTotal = finishingItems.reduce(
        (total, item) => total + item.cost,
        0,
    );
    const finishingTotal =
        finishingItemsTotal + finishingShipping + finishingOtherCost;
    const finishingDp = finishingTotal * (finishingDpPercent / 100);
    const finishingWeeklyTotal = Math.max(finishingTotal - finishingDp, 0);
    const finishingWeekly =
        finishingInstallments > 0
            ? finishingWeeklyTotal / finishingInstallments
            : 0;
    const grandTotal = nonFinishingTotal + finishingTotal;

    function resetForm() {
        setStep(0);
        setCustomer('');
        setVillage('');
        setSpecification('');
        setLength(0);
        setWidth(0);
        setPricePerMeter(0);
        setRequestItems([{ id: 1, label: 'Atap model limas', cost: 0 }]);
        setRequestShipping(0);
        setRequestOtherCost(0);
        setRequestDpPercent(0);
        setRequestStartPercent(0);
        setRequestInstallments(0);
        setFinishingItems([]);
        setFinishingShipping(0);
        setFinishingOtherCost(0);
        setFinishingDpPercent(0);
        setFinishingInstallments(0);
    }

    function resetDialog(nextOpen: boolean) {
        setOpen(nextOpen);

        if (nextOpen) {
            resetForm();
        }
    }

    function numberValue(value: string) {
        return Number(value) || 0;
    }

    function nextItemId(items: CostItem[]) {
        return Math.max(0, ...items.map((item) => item.id)) + 1;
    }

    function addRequestCustomItem() {
        setRequestItems((current) => [
            ...current,
            {
                id: nextItemId(current),
                label: `Item custom ${current.filter((item) => item.custom).length + 1}`,
                cost: 0,
                custom: true,
            },
        ]);
    }

    function addRequestCatalogItem(label: string) {
        setRequestItems((current) => [
            ...current,
            {
                id: nextItemId(current),
                label,
                cost: 0,
            },
        ]);
    }

    function updateRequestItem(id: number, changes: Partial<CostItem>) {
        setRequestItems((current) =>
            current.map((item) =>
                item.id === id ? { ...item, ...changes } : item,
            ),
        );
    }

    function removeRequestItem(id: number) {
        setRequestItems((current) =>
            current.length > 1
                ? current.filter((item) => item.id !== id)
                : current,
        );
    }

    function addFinishingCustomItem() {
        setFinishingItems((current) => [
            ...current,
            {
                id: nextItemId(current),
                label: `Item custom ${current.filter((item) => item.custom).length + 1}`,
                cost: 0,
                custom: true,
            },
        ]);
    }

    function addFinishingCatalogItem(label: string) {
        setFinishingItems((current) => [
            ...current,
            {
                id: nextItemId(current),
                label,
                cost: 0,
            },
        ]);
    }

    function updateFinishingItem(id: number, changes: Partial<CostItem>) {
        setFinishingItems((current) =>
            current.map((item) =>
                item.id === id ? { ...item, ...changes } : item,
            ),
        );
    }

    function removeFinishingItem(id: number) {
        setFinishingItems((current) =>
            current.filter((item) => item.id !== id),
        );
    }

    function handleSave() {
        setSaving(true);

        router.post('/dashboard/rab-project', {
            customer_name: customer.trim() || 'Tanpa Nama',
            village_name: village.trim() || '-',
            length,
            width,
            building_area: buildingArea,
            price_per_meter: pricePerMeter,
            building_cost: buildingCost,
            specification: specification.trim() || null,
            request_items: requestItems.map((item) => ({
                label: item.label.trim() || 'Item tanpa nama',
                cost: item.cost,
            })),
            request_items_total: requestItemsTotal,
            request_shipping_cost: requestShipping,
            request_other_cost: requestOtherCost,
            request_dp_percent: requestDpPercent,
            request_start_percent: requestStartPercent,
            request_installments: requestInstallments,
            finishing_items: finishingItems.map((item) => ({
                label: item.label.trim() || 'Item tanpa nama',
                cost: item.cost,
            })),
            finishing_items_total: finishingItemsTotal,
            finishing_shipping_cost: finishingShipping,
            finishing_other_cost: finishingOtherCost,
            finishing_dp_percent: finishingDpPercent,
            finishing_installments: finishingInstallments,
            grand_total: grandTotal,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                resetForm();
                setOpen(false);
            },
            onFinish: () => setSaving(false),
        });
    }

    return (
        <Dialog open={open} onOpenChange={resetDialog}>
            <DialogTrigger asChild>
                <Button className="shrink-0">
                    <Plus />
                    Buat RAB Baru
                </Button>
            </DialogTrigger>
            <DialogContent className="grid h-[min(90vh,760px)] grid-rows-[auto_1fr_auto] gap-4 overflow-hidden sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Buat RAB Baru</DialogTitle>
                    <DialogDescription>
                        Lengkapi data pembangunan, biaya request, dan biaya
                        finishing untuk membuat RAB project.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="min-h-0 pr-2">
                    <div className="grid gap-6">
                    <div className="grid gap-2 sm:grid-cols-3">
                        {rabSteps.map((item, index) => (
                            <div
                                key={item}
                                className={`rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                                    step === index
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'bg-background hover:bg-muted'
                                }`}
                            >
                                <span className="block text-xs opacity-80">
                                    Langkah {index + 1}
                                </span>
                                <span className="font-medium">{item}</span>
                            </div>
                        ))}
                    </div>

                    {step === 0 && (
                        <div className="grid gap-5">
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label="Nama Konsumen">
                                    <Input
                                        value={customer}
                                        onChange={(event) =>
                                            setCustomer(event.target.value)
                                        }
                                        placeholder="Nama konsumen"
                                    />
                                </Field>
                                <Field label="Nama Desa">
                                    <Input
                                        value={village}
                                        onChange={(event) =>
                                            setVillage(event.target.value)
                                        }
                                        placeholder="Nama desa"
                                    />
                                </Field>
                                <Field label="Panjang (m)">
                                    <Input
                                        type="number"
                                        min="0"
                                        value={length}
                                        onChange={(event) =>
                                            setLength(
                                                numberValue(event.target.value),
                                            )
                                        }
                                    />
                                </Field>
                                <Field label="Lebar (m)">
                                    <Input
                                        type="number"
                                        min="0"
                                        value={width}
                                        onChange={(event) =>
                                            setWidth(
                                                numberValue(event.target.value),
                                            )
                                        }
                                    />
                                </Field>
                                <Field label="Harga per m2">
                                    <Input
                                        type="number"
                                        min="0"
                                        value={pricePerMeter}
                                        onChange={(event) =>
                                            setPricePerMeter(
                                                numberValue(event.target.value),
                                            )
                                        }
                                    />
                                </Field>
                                <Field label="Spesifikasi Sloof/Kolom/Ring Balk">
                                    <Select
                                        value={specification}
                                        onValueChange={setSpecification}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih spesifikasi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {structureSpecifications.map(
                                                (item) => (
                                                    <SelectItem
                                                        key={item}
                                                        value={item}
                                                    >
                                                        {item}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>
                            <div className="grid gap-3 rounded-lg border bg-muted/30 p-4">
                                <SummaryRow
                                    label="Luas Bangunan"
                                    value={`${buildingArea} m2`}
                                />
                                <SummaryRow
                                    label="Biaya Pembangunan"
                                    value={formatRupiah(buildingCost)}
                                />
                                <SummaryRow
                                    label="Spesifikasi Sloof/Kolom/Ring Balk"
                                    value={specification || '-'}
                                />
                                <SummaryRow
                                    label="Grand Total RAB"
                                    value={formatRupiah(buildingCost)}
                                    strong
                                />
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="grid gap-5">
                            <div className="grid gap-4 rounded-lg border p-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h3 className="font-medium">
                                        Item Biaya Request
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addRequestCustomItem}
                                        >
                                            <Plus />
                                            Item Custom
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Plus />
                                                    Dari Katalog
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-56"
                                            >
                                                {requestCatalogItems.map(
                                                    (item) => (
                                                        <DropdownMenuItem
                                                            key={item}
                                                            onClick={() =>
                                                                addRequestCatalogItem(
                                                                    item,
                                                                )
                                                            }
                                                        >
                                                            {item}
                                                        </DropdownMenuItem>
                                                    ),
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    {requestItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="grid gap-2 md:grid-cols-[1fr_180px_40px] md:items-end"
                                        >
                                            <Field label="Item">
                                                <Input
                                                    value={item.label}
                                                    readOnly={!item.custom}
                                                    onChange={(event) =>
                                                        updateRequestItem(
                                                            item.id,
                                                            {
                                                                label: event
                                                                    .target
                                                                    .value,
                                                            },
                                                        )
                                                    }
                                                />
                                            </Field>
                                            <Field label="Biaya">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={item.cost}
                                                    onChange={(event) =>
                                                        updateRequestItem(
                                                            item.id,
                                                            {
                                                                cost: numberValue(
                                                                    event
                                                                        .target
                                                                        .value,
                                                                ),
                                                            },
                                                        )
                                                    }
                                                />
                                            </Field>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="size-9 text-muted-foreground"
                                                onClick={() =>
                                                    removeRequestItem(item.id)
                                                }
                                                disabled={
                                                    requestItems.length === 1
                                                }
                                            >
                                                <Trash2 />
                                                <span className="sr-only">
                                                    Hapus item
                                                </span>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid gap-3 md:grid-cols-2">
                                    <Field label="Ongkos Kirim Material">
                                        <Input
                                            type="number"
                                            min="0"
                                            value={requestShipping}
                                            onChange={(event) =>
                                                setRequestShipping(
                                                    numberValue(
                                                        event.target.value,
                                                    ),
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field label="Biaya Lain-lain">
                                        <Input
                                            type="number"
                                            min="0"
                                            value={requestOtherCost}
                                            onChange={(event) =>
                                                setRequestOtherCost(
                                                    numberValue(
                                                        event.target.value,
                                                    ),
                                                )
                                            }
                                        />
                                    </Field>
                                </div>
                            </div>

                            <div className="grid gap-3 rounded-lg border bg-muted/30 p-4">
                                <SummaryRow
                                    label="Biaya Pembangunan"
                                    value={formatRupiah(buildingCost)}
                                />
                                <SummaryRow
                                    label="Total Biaya Request"
                                    value={formatRupiah(requestItemsTotal)}
                                />
                                <SummaryRow
                                    label="Ongkos Kirim"
                                    value={formatRupiah(requestShipping)}
                                />
                                <SummaryRow
                                    label="Biaya Lain-lain"
                                    value={formatRupiah(requestOtherCost)}
                                />
                                <SummaryRow
                                    label="Total Biaya Rumah Non-Finishing"
                                    value={formatRupiah(nonFinishingTotal)}
                                    strong
                                />
                            </div>

                            <div className="grid gap-4 rounded-lg border p-4">
                                <h3 className="font-medium">Skema Pembayaran</h3>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <Field label="DP (%)">
                                        <Input
                                            type="number"
                                            min="0"
                                            value={requestDpPercent}
                                            onChange={(event) =>
                                                setRequestDpPercent(
                                                    numberValue(
                                                        event.target.value,
                                                    ),
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field label="Mulai Pembangunan (%)">
                                        <Input
                                            type="number"
                                            min="0"
                                            value={requestStartPercent}
                                            onChange={(event) =>
                                                setRequestStartPercent(
                                                    numberValue(
                                                        event.target.value,
                                                    ),
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field label="Jumlah Angsuran Mingguan">
                                        <Input
                                            type="number"
                                            min="0"
                                            value={requestInstallments}
                                            onChange={(event) =>
                                                setRequestInstallments(
                                                    numberValue(
                                                        event.target.value,
                                                    ),
                                                )
                                            }
                                        />
                                    </Field>
                                </div>
                                <div className="grid gap-3 rounded-lg bg-muted/30 p-4">
                                    <SummaryRow
                                        label={`DP (${requestDpPercent}%)`}
                                        value={formatRupiah(requestDp)}
                                    />
                                    <SummaryRow
                                        label={`Mulai Pembangunan (${requestStartPercent}%)`}
                                        value={formatRupiah(requestStart)}
                                    />
                                    <SummaryRow
                                        label="Mingguan"
                                        value={formatRupiah(requestWeeklyTotal)}
                                    />
                                    <SummaryRow
                                        label={`${requestInstallments} x angsuran`}
                                        value={`${formatRupiah(requestWeekly)}/minggu`}
                                    />
                                    <SummaryRow
                                        label="Grand Total RAB"
                                        value={formatRupiah(nonFinishingTotal)}
                                        strong
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid gap-5">
                            <div className="grid gap-4 rounded-lg border p-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h3 className="font-medium">
                                        Item Biaya Finishing
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Plus />
                                                    Dari Katalog
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-64"
                                            >
                                                {finishingCatalogItems.map(
                                                    (item) => (
                                                        <DropdownMenuItem
                                                            key={item}
                                                            onClick={() =>
                                                                addFinishingCatalogItem(
                                                                    item,
                                                                )
                                                            }
                                                        >
                                                            {item}
                                                        </DropdownMenuItem>
                                                    ),
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addFinishingCustomItem}
                                        >
                                            <Plus />
                                            Item Custom
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    {finishingItems.length > 0 ? (
                                        finishingItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="grid gap-2 md:grid-cols-[1fr_180px_40px] md:items-end"
                                            >
                                                <Field label="Item">
                                                    <Input
                                                        value={item.label}
                                                        readOnly={!item.custom}
                                                        onChange={(event) =>
                                                            updateFinishingItem(
                                                                item.id,
                                                                {
                                                                    label: event
                                                                        .target
                                                                        .value,
                                                                },
                                                            )
                                                        }
                                                    />
                                                </Field>
                                                <Field label="Biaya">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={item.cost}
                                                        onChange={(event) =>
                                                            updateFinishingItem(
                                                                item.id,
                                                                {
                                                                    cost: numberValue(
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    ),
                                                                },
                                                            )
                                                        }
                                                    />
                                                </Field>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-9 text-muted-foreground"
                                                    onClick={() =>
                                                        removeFinishingItem(
                                                            item.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 />
                                                    <span className="sr-only">
                                                        Hapus item
                                                    </span>
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                                            Belum ada item finishing. Tambahkan
                                            dari katalog atau item custom.
                                        </div>
                                    )}
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Field label="Ongkos Kirim Material">
                                        <Input
                                            type="number"
                                            min="0"
                                            value={finishingShipping}
                                            onChange={(event) =>
                                                setFinishingShipping(
                                                    numberValue(
                                                        event.target.value,
                                                    ),
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field label="Biaya Lain-lain">
                                        <Input
                                            type="number"
                                            min="0"
                                            value={finishingOtherCost}
                                            onChange={(event) =>
                                                setFinishingOtherCost(
                                                    numberValue(
                                                        event.target.value,
                                                    ),
                                                )
                                            }
                                        />
                                    </Field>
                                </div>
                            </div>

                            <div className="grid gap-3 rounded-lg border bg-muted/30 p-4">
                                <SummaryRow
                                    label="Total Item Finishing"
                                    value={formatRupiah(finishingItemsTotal)}
                                />
                                <SummaryRow
                                    label="Ongkos Kirim"
                                    value={formatRupiah(finishingShipping)}
                                />
                                <SummaryRow
                                    label="Biaya Lain-lain"
                                    value={formatRupiah(finishingOtherCost)}
                                />
                                <SummaryRow
                                    label="Total Biaya Rumah Finishing"
                                    value={formatRupiah(finishingTotal)}
                                    strong
                                />
                            </div>

                            <div className="grid gap-4 rounded-lg border p-4">
                                <h3 className="font-medium">Skema Pembayaran</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Field label="DP (%)">
                                        <Input
                                            type="number"
                                            min="0"
                                            value={finishingDpPercent}
                                            onChange={(event) =>
                                                setFinishingDpPercent(
                                                    numberValue(
                                                        event.target.value,
                                                    ),
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field label="Jumlah Angsuran Mingguan">
                                        <Input
                                            type="number"
                                            min="0"
                                            value={finishingInstallments}
                                            onChange={(event) =>
                                                setFinishingInstallments(
                                                    numberValue(
                                                        event.target.value,
                                                    ),
                                                )
                                            }
                                        />
                                    </Field>
                                </div>
                                <div className="grid gap-3 rounded-lg bg-muted/30 p-4">
                                    <SummaryRow
                                        label={`DP (${finishingDpPercent}%)`}
                                        value={formatRupiah(finishingDp)}
                                    />
                                    <SummaryRow
                                        label="Mingguan"
                                        value={formatRupiah(
                                            finishingWeeklyTotal,
                                        )}
                                    />
                                    <SummaryRow
                                        label={`${finishingInstallments} x angsuran`}
                                        value={`${formatRupiah(finishingWeekly)}/minggu`}
                                    />
                                    <SummaryRow
                                        label="Grand Total RAB"
                                        value={formatRupiah(grandTotal)}
                                        strong
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    </div>
                </ScrollArea>

                <DialogFooter className="gap-2 sm:justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={step === 0}
                        onClick={() => setStep((current) => current - 1)}
                    >
                        Sebelumnya
                    </Button>
                    <div className="flex flex-col-reverse gap-2 sm:flex-row">
                        {step < rabSteps.length - 1 ? (
                            <Button
                                type="button"
                                onClick={() =>
                                    setStep((current) => current + 1)
                                }
                            >
                                Lanjut
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                disabled={saving}
                                onClick={handleSave}
                            >
                                Simpan RAB
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function DetailSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="grid gap-3 rounded-lg border p-4">
            <h3 className="font-medium">{title}</h3>
            {children}
        </div>
    );
}

function RabViewDialog({
    project,
    onOpenChange,
}: {
    project: RabProjectRow | null;
    onOpenChange: (open: boolean) => void;
}) {
    return (
        <Dialog open={Boolean(project)} onOpenChange={onOpenChange}>
            <DialogContent className="grid h-[min(90vh,720px)] grid-rows-[auto_1fr] overflow-hidden sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Detail RAB</DialogTitle>
                    <DialogDescription>
                        Ringkasan data RAB project.
                    </DialogDescription>
                </DialogHeader>
                {project && (
                    <ScrollArea className="min-h-0 pr-2">
                        <div className="grid gap-4">
                            <DetailSection title="Data Pembangunan">
                                <SummaryRow label="Nama Konsumen" value={project.customer} />
                                <SummaryRow label="Desa" value={project.village} />
                                <SummaryRow label="Luas Bangunan" value={project.area} />
                                <SummaryRow label="Harga per m2" value={formatRupiah(project.pricePerMeter)} />
                                <SummaryRow label="Biaya Pembangunan" value={formatRupiah(project.buildingCost)} />
                                <SummaryRow label="Spesifikasi" value={project.specification || '-'} />
                            </DetailSection>
                            <DetailSection title="Biaya Request">
                                {project.requestItems.length > 0 ? (
                                    project.requestItems.map((item) => (
                                        <SummaryRow
                                            key={`${item.label}-${item.cost}`}
                                            label={item.label}
                                            value={formatRupiah(item.cost)}
                                        />
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">Tidak ada item request.</p>
                                )}
                                <SummaryRow label="Ongkos Kirim" value={formatRupiah(project.requestShippingCost)} />
                                <SummaryRow label="Biaya Lain-lain" value={formatRupiah(project.requestOtherCost)} />
                            </DetailSection>
                            <DetailSection title="Biaya Finishing">
                                {project.finishingItems.length > 0 ? (
                                    project.finishingItems.map((item) => (
                                        <SummaryRow
                                            key={`${item.label}-${item.cost}`}
                                            label={item.label}
                                            value={formatRupiah(item.cost)}
                                        />
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">Tidak ada item finishing.</p>
                                )}
                                <SummaryRow label="Ongkos Kirim" value={formatRupiah(project.finishingShippingCost)} />
                                <SummaryRow label="Biaya Lain-lain" value={formatRupiah(project.finishingOtherCost)} />
                            </DetailSection>
                            <DetailSection title="Total">
                                <SummaryRow label="Status" value={project.status} />
                                <SummaryRow label="Grand Total RAB" value={formatRupiah(project.total)} strong />
                            </DetailSection>
                        </div>
                    </ScrollArea>
                )}
            </DialogContent>
        </Dialog>
    );
}

function RabEditDialog({
    project,
    onOpenChange,
}: {
    project: RabProjectRow | null;
    onOpenChange: (open: boolean) => void;
}) {
    const [customer, setCustomer] = useState(project?.customer ?? '');
    const [village, setVillage] = useState(project?.village ?? '');
    const [length, setLength] = useState(project?.length ?? 0);
    const [width, setWidth] = useState(project?.width ?? 0);
    const [pricePerMeter, setPricePerMeter] = useState(project?.pricePerMeter ?? 0);
    const [specification, setSpecification] = useState(project?.specification ?? '');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!project) {
            return;
        }

        setCustomer(project.customer);
        setVillage(project.village);
        setLength(project.length);
        setWidth(project.width);
        setPricePerMeter(project.pricePerMeter);
        setSpecification(project.specification ?? '');
    }, [project]);

    const buildingArea = length * width;
    const buildingCost = buildingArea * pricePerMeter;
    const requestTotal =
        (project?.requestItemsTotal ?? 0) +
        (project?.requestShippingCost ?? 0) +
        (project?.requestOtherCost ?? 0);
    const finishingTotal =
        (project?.finishingItemsTotal ?? 0) +
        (project?.finishingShippingCost ?? 0) +
        (project?.finishingOtherCost ?? 0);
    const grandTotal = buildingCost + requestTotal + finishingTotal;

    if (!project) {
        return null;
    }

    const editingProject = project;

    function numberValue(value: string) {
        return Number(value) || 0;
    }

    function handleSubmit() {
        setSaving(true);
        router.patch(
            `/dashboard/rab-project/${editingProject.id}`,
            {
                customer_name: customer.trim() || 'Tanpa Nama',
                village_name: village.trim() || '-',
                length,
                width,
                building_area: buildingArea,
                price_per_meter: pricePerMeter,
                building_cost: buildingCost,
                specification: specification || null,
                grand_total: grandTotal,
            },
            {
                preserveScroll: true,
                onSuccess: () => onOpenChange(false),
                onFinish: () => setSaving(false),
            },
        );
    }

    return (
        <Dialog open={Boolean(project)} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit RAB</DialogTitle>
                    <DialogDescription>
                        Edit data utama RAB. Detail item request dan finishing tetap mengikuti data tersimpan.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Nama Konsumen">
                        <Input value={customer} onChange={(event) => setCustomer(event.target.value)} />
                    </Field>
                    <Field label="Nama Desa">
                        <Input value={village} onChange={(event) => setVillage(event.target.value)} />
                    </Field>
                    <Field label="Panjang (m)">
                        <Input type="number" min="0" value={length} onChange={(event) => setLength(numberValue(event.target.value))} />
                    </Field>
                    <Field label="Lebar (m)">
                        <Input type="number" min="0" value={width} onChange={(event) => setWidth(numberValue(event.target.value))} />
                    </Field>
                    <Field label="Harga per m2">
                        <Input type="number" min="0" value={pricePerMeter} onChange={(event) => setPricePerMeter(numberValue(event.target.value))} />
                    </Field>
                    <Field label="Spesifikasi Sloof/Kolom/Ring Balk">
                        <Select value={specification} onValueChange={setSpecification}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih spesifikasi" />
                            </SelectTrigger>
                            <SelectContent>
                                {structureSpecifications.map((item) => (
                                    <SelectItem key={item} value={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
                <div className="grid gap-3 rounded-lg border bg-muted/30 p-4">
                    <SummaryRow label="Luas Bangunan" value={`${buildingArea} m2`} />
                    <SummaryRow label="Biaya Pembangunan" value={formatRupiah(buildingCost)} />
                    <SummaryRow label="Grand Total RAB" value={formatRupiah(grandTotal)} strong />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Batal
                    </Button>
                    <Button disabled={saving} onClick={handleSubmit}>
                        Simpan Perubahan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function RabProject({
    rabProjects = [],
}: {
    rabProjects: RabProjectRow[];
}) {
    const [search, setSearch] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);
    const [viewProject, setViewProject] = useState<RabProjectRow | null>(null);
    const [editProject, setEditProject] = useState<RabProjectRow | null>(null);
    const [deleteProject, setDeleteProject] =
        useState<RabProjectRow | null>(null);

    const filteredProjects = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return rabProjects;
        }

        return rabProjects.filter((item) =>
            [
                item.customer,
                item.village,
                item.area,
                formatRupiah(item.total),
                item.status,
            ]
                .join(' ')
                .toLowerCase()
                .includes(keyword),
        );
    }, [rabProjects, search]);

    const pageCount = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
    const currentPage = Math.min(pageIndex, pageCount - 1);
    const startIndex = currentPage * pageSize;
    const visibleProjects = filteredProjects.slice(
        startIndex,
        startIndex + pageSize,
    );
    const from = filteredProjects.length === 0 ? 0 : startIndex + 1;
    const to = Math.min(startIndex + pageSize, filteredProjects.length);

    function handleSearch(value: string) {
        setSearch(value);
        setPageIndex(0);
    }

    function handlePageSize(value: string) {
        setPageSize(Number(value));
        setPageIndex(0);
    }

    function handleChangeStatus(projectId: number, status: string) {
        router.patch(
            `/dashboard/rab-project/${projectId}/status`,
            { status },
            {
                preserveScroll: true,
            },
        );
    }

    function handleDelete() {
        if (!deleteProject) {
            return;
        }

        router.delete(`/dashboard/rab-project/${deleteProject.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteProject(null),
        });
    }

    function handlePrint(project: RabProjectRow) {
        const printWindow = window.open('', '_blank', 'width=900,height=700');

        if (!printWindow) {
            window.print();
            return;
        }

        const requestRows = project.requestItems
            .map(
                (item) =>
                    `<tr><td>${item.label}</td><td>${formatRupiah(item.cost)}</td></tr>`,
            )
            .join('');
        const finishingRows = project.finishingItems
            .map(
                (item) =>
                    `<tr><td>${item.label}</td><td>${formatRupiah(item.cost)}</td></tr>`,
            )
            .join('');

        printWindow.document.write(`
            <html>
                <head>
                    <title>Print RAB - ${project.customer}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
                        h1 { margin: 0 0 8px; font-size: 24px; }
                        h2 { margin: 24px 0 8px; font-size: 16px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
                        td, th { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        .summary td:last-child { text-align: right; font-weight: 600; }
                    </style>
                </head>
                <body>
                    <h1>RAB Project</h1>
                    <table class="summary">
                        <tr><td>Nama Konsumen</td><td>${project.customer}</td></tr>
                        <tr><td>Desa</td><td>${project.village}</td></tr>
                        <tr><td>Luas Bangunan</td><td>${project.area}</td></tr>
                        <tr><td>Spesifikasi</td><td>${project.specification ?? '-'}</td></tr>
                        <tr><td>Status</td><td>${project.status}</td></tr>
                    </table>
                    <h2>Biaya Request</h2>
                    <table><tbody>${requestRows || '<tr><td colspan="2">Tidak ada item request.</td></tr>'}</tbody></table>
                    <h2>Biaya Finishing</h2>
                    <table><tbody>${finishingRows || '<tr><td colspan="2">Tidak ada item finishing.</td></tr>'}</tbody></table>
                    <h2>Total</h2>
                    <table class="summary">
                        <tr><td>Biaya Pembangunan</td><td>${formatRupiah(project.buildingCost)}</td></tr>
                        <tr><td>Grand Total RAB</td><td>${formatRupiah(project.total)}</td></tr>
                    </table>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }

    return (
        <>
            <Head title="RAB Project" />
            <RabViewDialog
                project={viewProject}
                onOpenChange={(open) => !open && setViewProject(null)}
            />
            <RabEditDialog
                project={editProject}
                onOpenChange={(open) => !open && setEditProject(null)}
            />
            <Dialog
                open={Boolean(deleteProject)}
                onOpenChange={(open) => !open && setDeleteProject(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Hapus RAB</DialogTitle>
                        <DialogDescription>
                            RAB {deleteProject?.customer} akan dihapus dari
                            sistem.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteProject(null)}
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
                    <h1 className="text-2xl font-semibold">RAB Project</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Kelola daftar RAB project dan status pengerjaannya.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(event) => handleSearch(event.target.value)}
                            placeholder="Cari RAB project..."
                            className="pl-9"
                        />
                    </div>
                    <CreateRabDialog />
                </div>

                <div className="overflow-hidden rounded-lg border bg-card">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Nama Konsumen</TableHead>
                                <TableHead>Desa</TableHead>
                                <TableHead>Luas</TableHead>
                                <TableHead>Total RAB</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-12" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visibleProjects.length > 0 ? (
                                visibleProjects.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {item.customer}
                                        </TableCell>
                                        <TableCell>{item.village}</TableCell>
                                        <TableCell>{item.area}</TableCell>
                                        <TableCell>
                                            {formatRupiah(item.total)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={statusVariant(
                                                    item.status,
                                                )}
                                            >
                                                {item.status}
                                            </Badge>
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
                                                            setViewProject(item)
                                                        }
                                                    >
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handlePrint(item)
                                                        }
                                                    >
                                                        Print
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setEditProject(item)
                                                        }
                                                    >
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSub>
                                                        <DropdownMenuSubTrigger>
                                                            Change Status
                                                        </DropdownMenuSubTrigger>
                                                        <DropdownMenuSubContent>
                                                            {statusOptions.map(
                                                                (status) => (
                                                                    <DropdownMenuItem
                                                                        key={
                                                                            status
                                                                        }
                                                                        disabled={
                                                                            status ===
                                                                            item.status
                                                                        }
                                                                        onClick={() =>
                                                                            handleChangeStatus(
                                                                                item.id,
                                                                                status,
                                                                            )
                                                                        }
                                                                    >
                                                                        {
                                                                            status
                                                                        }
                                                                    </DropdownMenuItem>
                                                                ),
                                                            )}
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuSub>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() =>
                                                            setDeleteProject(
                                                                item,
                                                            )
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
                        Menampilkan {from} - {to} dari{' '}
                        {filteredProjects.length} data
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2">
                            <Label
                                htmlFor="rows-per-page"
                                className="text-sm font-medium text-foreground"
                            >
                                Data per halaman
                            </Label>
                            <Select
                                value={`${pageSize}`}
                                onValueChange={handlePageSize}
                            >
                                <SelectTrigger
                                    id="rows-per-page"
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
                                <span className="sr-only">
                                    Halaman pertama
                                </span>
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
                                <span className="sr-only">
                                    Halaman sebelumnya
                                </span>
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
                                <span className="sr-only">
                                    Halaman berikutnya
                                </span>
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="hidden size-8 lg:inline-flex"
                                disabled={currentPage >= pageCount - 1}
                                onClick={() => setPageIndex(pageCount - 1)}
                            >
                                <ChevronsRight />
                                <span className="sr-only">
                                    Halaman terakhir
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

RabProject.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'RAB Project',
            href: '/dashboard/rab-project',
        },
    ],
};
