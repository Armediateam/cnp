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
    rabNumber: string | null;
    rabDate: string | null;
    projectName: string | null;
    projectAddress: string | null;
    floorPlanFiles: RabAttachment[];
    facadeFiles: RabAttachment[];
    area: string;
    total: number;
    status: string;
    length: number;
    width: number;
    buildingArea: number;
    pricePerMeter: number;
    buildingCost: number;
    specification: string | null;
    requestItems: Array<{
        label: string;
        cost: number;
        unit?: string | null;
        quantity?: number;
        unit_price?: number;
    }>;
    requestItemsTotal: number;
    requestShippingCost: number;
    requestOtherCost: number;
    requestDpPercent: number;
    requestStartPercent: number;
    requestInstallments: number;
    finishingItems: Array<{
        label: string;
        cost: number;
        unit?: string | null;
        quantity?: number;
        unit_price?: number;
    }>;
    finishingItemsTotal: number;
    finishingShippingCost: number;
    finishingOtherCost: number;
    finishingDpPercent: number;
    finishingInstallments: number;
};

type MasterDataRow = {
    id: number;
    category: string;
    name: string;
    value: number | null;
    unit: string | null;
};

type RabAttachment = {
    name: string;
    path: string;
    url: string;
    mime: string | null;
};

type CostItem = {
    id: number;
    label: string;
    unit: string;
    quantity: number;
    unitPrice: number;
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

const fallbackRequestCatalogItems: MasterDataRow[] = [
    {
        id: 1,
        category: 'request_cost',
        name: 'Atap model limas',
        value: 1000000,
        unit: 'm2',
    },
    {
        id: 2,
        category: 'request_cost',
        name: 'Tambah dinding',
        value: 0,
        unit: 'm2',
    },
    {
        id: 3,
        category: 'request_cost',
        name: 'Tambah tinggi dinding',
        value: 0,
        unit: 'm2',
    },
];

const fallbackFinishingCatalogItems: MasterDataRow[] = [
    {
        id: 1,
        category: 'finishing_cost',
        name: 'KM / WC',
        value: 4000000,
        unit: 'unit',
    },
    {
        id: 2,
        category: 'finishing_cost',
        name: 'Plesteran luar dalam',
        value: 235000,
        unit: 'm2',
    },
    {
        id: 3,
        category: 'finishing_cost',
        name: 'Acian luar dalam',
        value: 235000,
        unit: 'm2',
    },
    {
        id: 4,
        category: 'finishing_cost',
        name: 'Pasang keramik 40/40cm',
        value: 266223,
        unit: 'm2',
    },
    {
        id: 5,
        category: 'finishing_cost',
        name: 'Plafond luar dalam',
        value: 297111,
        unit: 'm2',
    },
    {
        id: 6,
        category: 'finishing_cost',
        name: 'Instalasi listrik',
        value: 66667,
        unit: 'm2',
    },
    {
        id: 7,
        category: 'finishing_cost',
        name: 'Pengecatan ex Nippon (putih)',
        value: 133333,
        unit: 'm2',
    },
    {
        id: 8,
        category: 'finishing_cost',
        name: 'Septictank',
        value: 6000000,
        unit: 'unit',
    },
    {
        id: 9,
        category: 'finishing_cost',
        name: 'Perawatan & pembersihan',
        value: 44444,
        unit: 'm2',
    },
];

const fallbackStructureSpecifications = [
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

function todayInputValue() {
    return new Date().toISOString().slice(0, 10);
}

function formatDateId(value: string | null) {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(`${value}T00:00:00`));
}

function escapeHtml(value: string | number | null | undefined) {
    return String(value ?? '-')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function costFromFormula(quantity: number, unitPrice: number) {
    return Math.round((Number(quantity) || 0) * (Number(unitPrice) || 0));
}

function itemFromMaster(item: MasterDataRow, id: number): CostItem {
    const quantity = item.unit === 'unit' || item.unit === 'item' ? 1 : 0;
    const unitPrice = item.value ?? 0;

    return {
        id,
        label: item.name,
        unit: item.unit ?? 'ls',
        quantity,
        unitPrice,
        cost: costFromFormula(quantity, unitPrice),
    };
}

function normalizeStoredItem(
    item: {
        label: string;
        cost: number;
        unit?: string | null;
        quantity?: number;
        unit_price?: number;
    },
    id: number,
): CostItem {
    const quantity = Number(item.quantity ?? 1) || 0;
    const unitPrice = Number(item.unit_price ?? item.cost) || 0;

    return {
        id,
        label: item.label,
        unit: item.unit ?? 'ls',
        quantity,
        unitPrice,
        cost: Number(item.cost ?? costFromFormula(quantity, unitPrice)) || 0,
    };
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

function CreateRabDialog({
    masterDataItems,
}: {
    masterDataItems: MasterDataRow[];
}) {
    const requestCatalogItems =
        masterDataItems.filter((item) => item.category === 'request_cost')
            .length > 0
            ? masterDataItems.filter((item) => item.category === 'request_cost')
            : fallbackRequestCatalogItems;
    const finishingCatalogItems =
        masterDataItems.filter((item) => item.category === 'finishing_cost')
            .length > 0
            ? masterDataItems.filter(
                  (item) => item.category === 'finishing_cost',
              )
            : fallbackFinishingCatalogItems;
    const structureSpecifications =
        masterDataItems
            .filter((item) => item.category === 'structure_specification')
            .map((item) => item.name).length > 0
            ? masterDataItems
                  .filter((item) => item.category === 'structure_specification')
                  .map((item) => item.name)
            : fallbackStructureSpecifications;
    const buildingPrice =
        masterDataItems.find(
            (item) =>
                item.category === 'building_price' &&
                item.name.toLowerCase().includes('non'),
        )?.value ?? 1700000;
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);
    const [customer, setCustomer] = useState('');
    const [village, setVillage] = useState('');
    const [rabNumber, setRabNumber] = useState('');
    const [rabDate, setRabDate] = useState(todayInputValue());
    const [projectName, setProjectName] = useState('');
    const [projectAddress, setProjectAddress] = useState('');
    const [specification, setSpecification] = useState('');
    const [length, setLength] = useState(0);
    const [width, setWidth] = useState(0);
    const [pricePerMeter, setPricePerMeter] = useState(buildingPrice);
    const [requestItems, setRequestItems] = useState<CostItem[]>([]);
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
    const [floorPlanFiles, setFloorPlanFiles] = useState<File[]>([]);
    const [facadeFiles, setFacadeFiles] = useState<File[]>([]);

    const buildingArea = length * width;
    const buildingCost = buildingArea * pricePerMeter;
    const requestItemsTotal = requestItems.reduce(
        (total, item) => total + item.cost,
        0,
    );
    const nonFinishingTotal =
        buildingCost + requestItemsTotal + requestShipping + requestOtherCost;
    const requestDp = nonFinishingTotal * (requestDpPercent / 100);
    const requestStart = nonFinishingTotal * (requestStartPercent / 100);
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
        setRabNumber('');
        setRabDate(todayInputValue());
        setProjectName('');
        setProjectAddress('');
        setSpecification('');
        setLength(0);
        setWidth(0);
        setPricePerMeter(buildingPrice);
        setRequestItems([]);
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
        setFloorPlanFiles([]);
        setFacadeFiles([]);
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
                unit: 'm2',
                quantity: 0,
                unitPrice: 0,
                cost: 0,
                custom: true,
            },
        ]);
    }

    function addRequestCatalogItem(item: MasterDataRow) {
        setRequestItems((current) => [
            ...current,
            itemFromMaster(item, nextItemId(current)),
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
                unit: 'm2',
                quantity: 0,
                unitPrice: 0,
                cost: 0,
                custom: true,
            },
        ]);
    }

    function addFinishingCatalogItem(item: MasterDataRow) {
        setFinishingItems((current) => [
            ...current,
            itemFromMaster(item, nextItemId(current)),
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

        router.post(
            '/dashboard/rab-project',
            {
                customer_name: customer.trim() || 'Tanpa Nama',
                village_name: village.trim() || '-',
                rab_number: rabNumber.trim() || null,
                rab_date: rabDate || null,
                project_name: projectName.trim() || null,
                project_address: projectAddress.trim() || null,
                floor_plan_files: floorPlanFiles,
                facade_files: facadeFiles,
                length,
                width,
                building_area: buildingArea,
                price_per_meter: pricePerMeter,
                building_cost: buildingCost,
                specification: specification.trim() || null,
                request_items: requestItems.map((item) => ({
                    label: item.label.trim() || 'Item tanpa nama',
                    unit: item.unit.trim() || null,
                    quantity: item.quantity,
                    unit_price: item.unitPrice,
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
                    unit: item.unit.trim() || null,
                    quantity: item.quantity,
                    unit_price: item.unitPrice,
                    cost: item.cost,
                })),
                finishing_items_total: finishingItemsTotal,
                finishing_shipping_cost: finishingShipping,
                finishing_other_cost: finishingOtherCost,
                finishing_dp_percent: finishingDpPercent,
                finishing_installments: finishingInstallments,
                grand_total: grandTotal,
            },
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    resetForm();
                    setOpen(false);
                },
                onFinish: () => setSaving(false),
            },
        );
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
                                    <Field label="Nomor RAB">
                                        <Input
                                            value={rabNumber}
                                            onChange={(event) =>
                                                setRabNumber(event.target.value)
                                            }
                                            placeholder="Contoh: RAB-001"
                                        />
                                    </Field>
                                    <Field label="Tanggal RAB">
                                        <Input
                                            type="date"
                                            value={rabDate}
                                            onChange={(event) =>
                                                setRabDate(event.target.value)
                                            }
                                        />
                                    </Field>
                                    <Field label="Nama Pekerjaan / Proyek">
                                        <Input
                                            value={projectName}
                                            onChange={(event) =>
                                                setProjectName(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Contoh: Rumah 6 x 7 m"
                                        />
                                    </Field>
                                    <Field label="Alamat / Lokasi Proyek">
                                        <Input
                                            value={projectAddress}
                                            onChange={(event) =>
                                                setProjectAddress(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Alamat lengkap proyek"
                                        />
                                    </Field>
                                    <Field label="Panjang (m)">
                                        <Input
                                            type="number"
                                            min="0"
                                            value={length}
                                            onChange={(event) =>
                                                setLength(
                                                    numberValue(
                                                        event.target.value,
                                                    ),
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
                                                    numberValue(
                                                        event.target.value,
                                                    ),
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
                                                    numberValue(
                                                        event.target.value,
                                                    ),
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
                                <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                                    <Field label="Upload Denah">
                                        <Input
                                            type="file"
                                            multiple
                                            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                                            onChange={(event) =>
                                                setFloorPlanFiles(
                                                    Array.from(
                                                        event.target.files ??
                                                            [],
                                                    ),
                                                )
                                            }
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Bisa lebih dari 1 file PNG, JPG,
                                            JPEG, atau PDF.
                                        </p>
                                    </Field>
                                    <Field label="Upload Desain Fasad / Modul Atap">
                                        <Input
                                            type="file"
                                            multiple
                                            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                                            onChange={(event) =>
                                                setFacadeFiles(
                                                    Array.from(
                                                        event.target.files ??
                                                            [],
                                                    ),
                                                )
                                            }
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Bisa lebih dari 1 file PNG, JPG,
                                            JPEG, atau PDF.
                                        </p>
                                    </Field>
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
                                                                key={item.id}
                                                                onClick={() =>
                                                                    addRequestCatalogItem(
                                                                        item,
                                                                    )
                                                                }
                                                            >
                                                                {item.name}
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
                                                className="grid gap-2 md:grid-cols-[1fr_110px_90px_150px_150px_40px] md:items-end"
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
                                                <Field label="Volume / Luas">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.001"
                                                        value={item.quantity}
                                                        onChange={(event) =>
                                                            updateRequestItem(
                                                                item.id,
                                                                (() => {
                                                                    const quantity =
                                                                        numberValue(
                                                                            event
                                                                                .target
                                                                                .value,
                                                                        );

                                                                    return {
                                                                        quantity,
                                                                        cost: costFromFormula(
                                                                            quantity,
                                                                            item.unitPrice,
                                                                        ),
                                                                    };
                                                                })(),
                                                            )
                                                        }
                                                    />
                                                </Field>
                                                <Field label="Satuan">
                                                    <Input
                                                        value={item.unit}
                                                        onChange={(event) =>
                                                            updateRequestItem(
                                                                item.id,
                                                                {
                                                                    unit: event
                                                                        .target
                                                                        .value,
                                                                },
                                                            )
                                                        }
                                                    />
                                                </Field>
                                                <Field label="Harga Satuan">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={item.unitPrice}
                                                        onChange={(event) =>
                                                            updateRequestItem(
                                                                item.id,
                                                                (() => {
                                                                    const unitPrice =
                                                                        numberValue(
                                                                            event
                                                                                .target
                                                                                .value,
                                                                        );

                                                                    return {
                                                                        unitPrice,
                                                                        cost: costFromFormula(
                                                                            item.quantity,
                                                                            unitPrice,
                                                                        ),
                                                                    };
                                                                })(),
                                                            )
                                                        }
                                                    />
                                                </Field>
                                                <Field label="Total">
                                                    <Input
                                                        value={formatRupiah(
                                                            item.cost,
                                                        )}
                                                        readOnly
                                                    />
                                                </Field>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-9 text-muted-foreground"
                                                    onClick={() =>
                                                        removeRequestItem(
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
                                    <h3 className="font-medium">
                                        Skema Pembayaran
                                    </h3>
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
                                            value={formatRupiah(
                                                requestWeeklyTotal,
                                            )}
                                        />
                                        <SummaryRow
                                            label={`${requestInstallments} x angsuran`}
                                            value={`${formatRupiah(requestWeekly)}/minggu`}
                                        />
                                        <SummaryRow
                                            label="Grand Total RAB"
                                            value={formatRupiah(
                                                nonFinishingTotal,
                                            )}
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
                                                                key={item.id}
                                                                onClick={() =>
                                                                    addFinishingCatalogItem(
                                                                        item,
                                                                    )
                                                                }
                                                            >
                                                                {item.name}
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
                                                    className="grid gap-2 md:grid-cols-[1fr_110px_90px_150px_150px_40px] md:items-end"
                                                >
                                                    <Field label="Item">
                                                        <Input
                                                            value={item.label}
                                                            readOnly={
                                                                !item.custom
                                                            }
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
                                                    <Field label="Volume / Luas">
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.001"
                                                            value={
                                                                item.quantity
                                                            }
                                                            onChange={(event) =>
                                                                updateFinishingItem(
                                                                    item.id,
                                                                    (() => {
                                                                        const quantity =
                                                                            numberValue(
                                                                                event
                                                                                    .target
                                                                                    .value,
                                                                            );

                                                                        return {
                                                                            quantity,
                                                                            cost: costFromFormula(
                                                                                quantity,
                                                                                item.unitPrice,
                                                                            ),
                                                                        };
                                                                    })(),
                                                                )
                                                            }
                                                        />
                                                    </Field>
                                                    <Field label="Satuan">
                                                        <Input
                                                            value={item.unit}
                                                            onChange={(event) =>
                                                                updateFinishingItem(
                                                                    item.id,
                                                                    {
                                                                        unit: event
                                                                            .target
                                                                            .value,
                                                                    },
                                                                )
                                                            }
                                                        />
                                                    </Field>
                                                    <Field label="Harga Satuan">
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={
                                                                item.unitPrice
                                                            }
                                                            onChange={(event) =>
                                                                updateFinishingItem(
                                                                    item.id,
                                                                    (() => {
                                                                        const unitPrice =
                                                                            numberValue(
                                                                                event
                                                                                    .target
                                                                                    .value,
                                                                            );

                                                                        return {
                                                                            unitPrice,
                                                                            cost: costFromFormula(
                                                                                item.quantity,
                                                                                unitPrice,
                                                                            ),
                                                                        };
                                                                    })(),
                                                                )
                                                            }
                                                        />
                                                    </Field>
                                                    <Field label="Total">
                                                        <Input
                                                            value={formatRupiah(
                                                                item.cost,
                                                            )}
                                                            readOnly
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
                                                Belum ada item finishing.
                                                Tambahkan dari katalog atau item
                                                custom.
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
                                        value={formatRupiah(
                                            finishingItemsTotal,
                                        )}
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
                                    <h3 className="font-medium">
                                        Skema Pembayaran
                                    </h3>
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
                                <SummaryRow
                                    label="Nama Konsumen"
                                    value={project.customer}
                                />
                                <SummaryRow
                                    label="Desa"
                                    value={project.village}
                                />
                                <SummaryRow
                                    label="Nomor RAB"
                                    value={project.rabNumber || '-'}
                                />
                                <SummaryRow
                                    label="Tanggal RAB"
                                    value={formatDateId(project.rabDate)}
                                />
                                <SummaryRow
                                    label="Nama Pekerjaan / Proyek"
                                    value={project.projectName || '-'}
                                />
                                <SummaryRow
                                    label="Alamat / Lokasi Proyek"
                                    value={project.projectAddress || '-'}
                                />
                                <SummaryRow
                                    label="File Denah"
                                    value={`${project.floorPlanFiles.length} file`}
                                />
                                <SummaryRow
                                    label="File Desain Fasad"
                                    value={`${project.facadeFiles.length} file`}
                                />
                                <SummaryRow
                                    label="Luas Bangunan"
                                    value={project.area}
                                />
                                <SummaryRow
                                    label="Harga per m2"
                                    value={formatRupiah(project.pricePerMeter)}
                                />
                                <SummaryRow
                                    label="Biaya Pembangunan"
                                    value={formatRupiah(project.buildingCost)}
                                />
                                <SummaryRow
                                    label="Spesifikasi"
                                    value={project.specification || '-'}
                                />
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
                                    <p className="text-sm text-muted-foreground">
                                        Tidak ada item request.
                                    </p>
                                )}
                                <SummaryRow
                                    label="Ongkos Kirim"
                                    value={formatRupiah(
                                        project.requestShippingCost,
                                    )}
                                />
                                <SummaryRow
                                    label="Biaya Lain-lain"
                                    value={formatRupiah(
                                        project.requestOtherCost,
                                    )}
                                />
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
                                    <p className="text-sm text-muted-foreground">
                                        Tidak ada item finishing.
                                    </p>
                                )}
                                <SummaryRow
                                    label="Ongkos Kirim"
                                    value={formatRupiah(
                                        project.finishingShippingCost,
                                    )}
                                />
                                <SummaryRow
                                    label="Biaya Lain-lain"
                                    value={formatRupiah(
                                        project.finishingOtherCost,
                                    )}
                                />
                            </DetailSection>
                            <DetailSection title="Total">
                                <SummaryRow
                                    label="Status"
                                    value={project.status}
                                />
                                <SummaryRow
                                    label="Grand Total RAB"
                                    value={formatRupiah(project.total)}
                                    strong
                                />
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
    masterDataItems,
    onOpenChange,
}: {
    project: RabProjectRow | null;
    masterDataItems: MasterDataRow[];
    onOpenChange: (open: boolean) => void;
}) {
    const structureSpecifications =
        masterDataItems
            .filter((item) => item.category === 'structure_specification')
            .map((item) => item.name).length > 0
            ? masterDataItems
                  .filter((item) => item.category === 'structure_specification')
                  .map((item) => item.name)
            : fallbackStructureSpecifications;
    const [customer, setCustomer] = useState(project?.customer ?? '');
    const [village, setVillage] = useState(project?.village ?? '');
    const [rabNumber, setRabNumber] = useState(project?.rabNumber ?? '');
    const [rabDate, setRabDate] = useState(
        project?.rabDate ?? todayInputValue(),
    );
    const [projectName, setProjectName] = useState(project?.projectName ?? '');
    const [projectAddress, setProjectAddress] = useState(
        project?.projectAddress ?? '',
    );
    const [floorPlanFiles, setFloorPlanFiles] = useState<File[]>([]);
    const [facadeFiles, setFacadeFiles] = useState<File[]>([]);
    const [length, setLength] = useState(project?.length ?? 0);
    const [width, setWidth] = useState(project?.width ?? 0);
    const [pricePerMeter, setPricePerMeter] = useState(
        project?.pricePerMeter ?? 0,
    );
    const [specification, setSpecification] = useState(
        project?.specification ?? '',
    );
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!project) {
            return;
        }

        setCustomer(project.customer);
        setVillage(project.village);
        setRabNumber(project.rabNumber ?? '');
        setRabDate(project.rabDate ?? todayInputValue());
        setProjectName(project.projectName ?? '');
        setProjectAddress(project.projectAddress ?? '');
        setFloorPlanFiles([]);
        setFacadeFiles([]);
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
                rab_number: rabNumber.trim() || null,
                rab_date: rabDate || null,
                project_name: projectName.trim() || null,
                project_address: projectAddress.trim() || null,
                floor_plan_files: floorPlanFiles,
                facade_files: facadeFiles,
                length,
                width,
                building_area: buildingArea,
                price_per_meter: pricePerMeter,
                building_cost: buildingCost,
                specification: specification || null,
                grand_total: grandTotal,
            },
            {
                forceFormData: true,
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
                        Edit data utama RAB. Detail item request dan finishing
                        tetap mengikuti data tersimpan.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Nama Konsumen">
                        <Input
                            value={customer}
                            onChange={(event) =>
                                setCustomer(event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Nama Desa">
                        <Input
                            value={village}
                            onChange={(event) => setVillage(event.target.value)}
                        />
                    </Field>
                    <Field label="Nomor RAB">
                        <Input
                            value={rabNumber}
                            onChange={(event) =>
                                setRabNumber(event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Tanggal RAB">
                        <Input
                            type="date"
                            value={rabDate}
                            onChange={(event) => setRabDate(event.target.value)}
                        />
                    </Field>
                    <Field label="Nama Pekerjaan / Proyek">
                        <Input
                            value={projectName}
                            onChange={(event) =>
                                setProjectName(event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Alamat / Lokasi Proyek">
                        <Input
                            value={projectAddress}
                            onChange={(event) =>
                                setProjectAddress(event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Tambah Denah">
                        <Input
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                            onChange={(event) =>
                                setFloorPlanFiles(
                                    Array.from(event.target.files ?? []),
                                )
                            }
                        />
                    </Field>
                    <Field label="Tambah Desain Fasad / Modul Atap">
                        <Input
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                            onChange={(event) =>
                                setFacadeFiles(
                                    Array.from(event.target.files ?? []),
                                )
                            }
                        />
                    </Field>
                    <Field label="Panjang (m)">
                        <Input
                            type="number"
                            min="0"
                            value={length}
                            onChange={(event) =>
                                setLength(numberValue(event.target.value))
                            }
                        />
                    </Field>
                    <Field label="Lebar (m)">
                        <Input
                            type="number"
                            min="0"
                            value={width}
                            onChange={(event) =>
                                setWidth(numberValue(event.target.value))
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
                    <SummaryRow
                        label="Luas Bangunan"
                        value={`${buildingArea} m2`}
                    />
                    <SummaryRow
                        label="Biaya Pembangunan"
                        value={formatRupiah(buildingCost)}
                    />
                    <SummaryRow
                        label="Grand Total RAB"
                        value={formatRupiah(grandTotal)}
                        strong
                    />
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
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
    masterDataItems = [],
}: {
    rabProjects: RabProjectRow[];
    masterDataItems: MasterDataRow[];
}) {
    const [search, setSearch] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);
    const [viewProject, setViewProject] = useState<RabProjectRow | null>(null);
    const [editProject, setEditProject] = useState<RabProjectRow | null>(null);
    const [deleteProject, setDeleteProject] = useState<RabProjectRow | null>(
        null,
    );

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

    const pageCount = Math.max(
        1,
        Math.ceil(filteredProjects.length / pageSize),
    );
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

        const nonFinishingTotal =
            project.buildingCost +
            project.requestItemsTotal +
            project.requestShippingCost +
            project.requestOtherCost;
        const finishingTotal =
            project.finishingItemsTotal +
            project.finishingShippingCost +
            project.finishingOtherCost;
        const hasFinishing =
            project.finishingItems.length > 0 || finishingTotal > 0;
        const requestDp = nonFinishingTotal * (project.requestDpPercent / 100);
        const requestStart =
            nonFinishingTotal * (project.requestStartPercent / 100);
        const requestWeeklyTotal = Math.max(
            nonFinishingTotal - requestDp - requestStart,
            0,
        );
        const requestWeekly =
            project.requestInstallments > 0
                ? requestWeeklyTotal / project.requestInstallments
                : 0;
        const finishingDp = finishingTotal * (project.finishingDpPercent / 100);
        const finishingWeeklyTotal = Math.max(finishingTotal - finishingDp, 0);
        const finishingWeekly =
            project.finishingInstallments > 0
                ? finishingWeeklyTotal / project.finishingInstallments
                : 0;
        const title =
            project.projectName || `${project.customer} - ${project.village}`;

        const printRupiah = (value: number) =>
            `Rp ${Math.round(Number(value) || 0).toLocaleString('id-ID')}`;
        const moneyCell = (value: number) => escapeHtml(printRupiah(value));
        const formattedArea = `${Number(project.buildingArea || 0).toLocaleString('id-ID')} m2`;
        const formattedSize = `${Number(project.length || 0).toLocaleString('id-ID')} x ${Number(project.width || 0).toLocaleString('id-ID')} m`;
        const displayTitle = title.toUpperCase();
        const baseWeeklyLabel =
            project.requestInstallments > 0
                ? `${moneyCell(requestWeekly)}`
                : moneyCell(requestWeeklyTotal);
        const finishingWeeklyLabel =
            project.finishingInstallments > 0
                ? `${moneyCell(finishingWeekly)}`
                : moneyCell(finishingWeeklyTotal);
        const weeklyRows = Array.from(
            { length: Math.max(project.requestInstallments, 0) },
            (_, index) => `
                <tr>
                    <td>Pembayaran Ke ${index + 1}${index === 0 ? '<br><span class="small-note">(saat mulai pemasangan kusen)</span>' : ''}</td>
                    <td class="center">${baseWeeklyLabel}</td>
                </tr>
            `,
        ).join('');

        const requestRows = project.requestItems
            .map((item, index) => normalizeStoredItem(item, index + 1))
            .map(
                (item, index) =>
                    `<li>${escapeHtml(item.label)} : ${moneyCell(item.cost)}</li>`,
            )
            .join('');
        const finishingRows = project.finishingItems
            .map((item, index) => normalizeStoredItem(item, index + 1))
            .map(
                (item, index) =>
                    `<tr>
                    <td>${index + 1}. ${escapeHtml(item.label)}</td>
                    <td>: ${moneyCell(item.cost)}</td>
                </tr>`,
            )
            .join('');
        const standardSpecifications = [
            ['Pondasi', 'Batu Belah (Tinggi 40cm + Sloof 15cm = 55cm)'],
            ['Sloof, Kolom, Ring balk', project.specification || 'Besi L'],
            ['Dinding', 'Pasangan Bata Merah (Tinggi Standart 3,5m)'],
            ['Kusen, pintu & jendela', 'Bahan Kayu Sekelas Cempaka'],
            ['Rangka Atap', 'Kayu Sekelas Medang'],
            ['Atap', 'Genteng Mantili, Kerpus, Lisplang GRC'],
            ['Lantai', 'Semen Floor Kasar'],
        ];
        const specificationRows = standardSpecifications
            .map(
                ([label, value]) => `
                    <tr>
                        <td>${escapeHtml(label)}</td>
                        <td>: ${escapeHtml(value)}</td>
                    </tr>
                `,
            )
            .join('');
        const freeItems = [
            'Closet Jongkok',
            'WC Lantai Kasar',
            'Pintu WC (PVC)',
            'KWH 2R',
        ]
            .map((item) => `<div class="free-box">${escapeHtml(item)}</div>`)
            .join('');
        const attachmentPages = (title: string, files: RabAttachment[]) =>
            files
                .map((file, index) => {
                    const isImage = file.mime?.startsWith('image/');
                    const body = isImage
                        ? `<img class="attachment-image" src="${escapeHtml(file.url)}" alt="${escapeHtml(file.name)}">`
                        : `<div class="attachment-file"><strong>${escapeHtml(file.name)}</strong><br>File PDF terlampir: ${escapeHtml(file.url)}</div>`;

                    return `
                        <section class="page attachment-page">
                            <div class="attachment-title ${title.toLowerCase().includes('desain') ? 'attachment-title-left' : ''}">${escapeHtml(title)}${files.length > 1 ? ` ${index + 1}` : ''}</div>
                            <div class="attachment-frame">${body}</div>
                        </section>
                    `;
                })
                .join('');

        printWindow.document.write(`
            <html>
                <head>
                    <title>RAB - ${escapeHtml(project.customer)}</title>
                    <style>
                        @page { size: A4; margin: 33mm 25mm 25mm 22mm; }
                        * { box-sizing: border-box; }
                        body {
                            margin: 0;
                            background: #fff;
                            color: #000;
                            font-family: Tahoma, Arial, sans-serif;
                            font-size: 10.5pt;
                            line-height: 1.18;
                        }
                        .page {
                            width: 210mm;
                            min-height: 297mm;
                            margin: 0 auto;
                            background: #fff;
                            padding: 33mm 25mm 25mm 22mm;
                            page-break-after: always;
                        }
                        .title-block {
                            color: #00ae50;
                            font-size: 12pt;
                            font-weight: 700;
                            margin-bottom: 18px;
                            text-align: center;
                            text-transform: uppercase;
                        }
                        .title-block p {
                            color: #00ae50;
                            font-size: 10.5pt;
                            font-weight: 400;
                            margin: 6px 0 0;
                            text-transform: none;
                        }
                        .summary-table {
                            border-collapse: collapse;
                            margin: 0 auto 18px;
                            width: 78mm;
                        }
                        .summary-table td {
                            padding: 1px 0;
                        }
                        .payment-type {
                            margin: 10px 0 16px;
                            text-align: center;
                        }
                        .free-title {
                            color: red;
                            font-weight: 700;
                            margin-bottom: 8px;
                            text-align: center;
                        }
                        .free-box {
                            border: 1px solid #000;
                            color: red;
                            margin: 0 0 9px;
                            padding: 1px 4px 2px;
                            text-align: center;
                            width: 100%;
                        }
                        .shipping-text {
                            margin: 4px 0 7px;
                            text-align: right;
                        }
                        .rule {
                            border: 0;
                            border-top: 1px solid #000;
                            margin: 0 0 11px;
                        }
                        .center { text-align: center; }
                        .section-center {
                            font-weight: 700;
                            margin: 11px 0 8px;
                            text-align: center;
                        }
                        .spec-title {
                            margin: 0 0 8px;
                            text-align: center;
                        }
                        .spec-table {
                            border-collapse: collapse;
                            border-bottom: 1px solid #000;
                            border-top: 1px solid #000;
                            margin: 8px 0 11px;
                            width: 100%;
                        }
                        .spec-table td {
                            padding: 4px 0;
                            vertical-align: top;
                        }
                        .spec-table td:first-child {
                            padding-left: 30px;
                            width: 42%;
                        }
                        .number-list {
                            margin: 0 auto 11px;
                            max-width: 92mm;
                            padding-left: 18px;
                        }
                        .number-list li {
                            margin-bottom: 2px;
                        }
                        .request-title,
                        .total-line,
                        .payment-heading {
                            font-weight: 700;
                            margin: 13px 0 9px;
                            text-align: center;
                        }
                        .request-list {
                            margin: 0 auto 12px;
                            max-width: 95mm;
                            padding-left: 18px;
                        }
                        .request-list li {
                            margin-bottom: 2px;
                        }
                        .black-total {
                            background: #0d0d0d;
                            color: #fff;
                            font-weight: 700;
                            margin: 8px 20mm 14px 0;
                            padding: 2px 8px;
                            text-align: right;
                        }
                        .payment-table {
                            border-collapse: collapse;
                            margin: 0 auto 7px;
                            width: 100%;
                        }
                        .payment-table td {
                            border: 1px solid #000;
                            padding: 4px 7px;
                            vertical-align: top;
                            width: 50%;
                        }
                        .small-note {
                            font-size: 9.5pt;
                        }
                        .price-note {
                            color: red;
                            font-weight: 700;
                            margin-top: 8px;
                            text-align: center;
                        }
                        .finishing-table {
                            border-collapse: collapse;
                            margin: 0 auto 12px;
                            width: 97mm;
                        }
                        .finishing-table td {
                            padding: 1px 0;
                            vertical-align: top;
                        }
                        .finishing-table td:first-child {
                            width: 70%;
                        }
                        .attachment-title {
                            border: 1px solid #6eac46;
                            font-weight: 700;
                            margin: 0 0 2mm;
                            padding: 1px 4px 2px;
                            text-align: center;
                            text-transform: uppercase;
                            width: 100%;
                        }
                        .attachment-title-left {
                            margin-right: auto;
                            text-align: right;
                            width: 115mm;
                        }
                        .attachment-frame {
                            align-items: center;
                            display: flex;
                            justify-content: center;
                            min-height: 260mm;
                            width: 100%;
                        }
                        .attachment-image {
                            max-height: 260mm;
                            max-width: 100%;
                            object-fit: contain;
                        }
                        .attachment-file {
                            border: 1px dashed #000;
                            padding: 18px;
                            text-align: center;
                            width: 100%;
                        }
                        @media print {
                            .page {
                                width: auto;
                                min-height: auto;
                                margin: 0;
                                padding: 0;
                            }
                            .page:last-child { page-break-after: auto; }
                        }
                    </style>
                </head>
                <body>
                    <main class="page">
                        <section class="title-block">
                            <div>RENCANA ANGGARAN BIAYA</div>
                            <div>${escapeHtml(displayTitle)}</div>
                            <p>Ayo Hitung Biaya Rumah Impianmu Bersama Kami !!</p>
                        </section>

                        <table class="summary-table">
                            <tbody>
                                <tr><td>Ukuran Bangunan</td><td>: ${escapeHtml(formattedSize)}</td></tr>
                                <tr><td>Luas Bangunan</td><td>: ${escapeHtml(formattedArea)}</td></tr>
                                <tr><td>Biaya Pembangunan</td><td>: <b>${moneyCell(project.buildingCost)}</b></td></tr>
                            </tbody>
                        </table>

                        <div class="payment-type">Pembayaran Cash Tempo</div>
                        <div class="free-title">FREE :</div>
                        ${freeItems}
                        <p class="shipping-text">Biaya Ongkos Kirim Material : ${moneyCell(project.requestShippingCost)}</p>
                        <hr class="rule">

                        <p class="center">Ruangan :</p>
                        <p class="section-center">Tata Letak Sesuai Denah Yang Diinginkan</p>
                        <p class="spec-title">Dengan Spesifikasi Teknik :</p>
                        <table class="spec-table">
                            <tbody>
                                ${specificationRows}
                            </tbody>
                        </table>

                        <p class="request-title">Konsumen Wajib Menyiapkan :</p>
                        <ol class="number-list">
                            <li>Air dan listrik untuk kerja tukang</li>
                            <li>Penginapan tukang</li>
                        </ol>

                        <p class="request-title">Biaya Request Desain / Spesifikasi Teknik :</p>
                        <ol class="request-list">
                            ${requestRows || '<li>Tidak ada request tambahan : Rp 0</li>'}
                        </ol>
                        <hr class="rule">
                        <p class="total-line">Total biaya request : <b>${moneyCell(project.requestItemsTotal)}</b></p>
                        <p class="total-line">Total keseluruhan biaya non finishing : ${moneyCell(nonFinishingTotal)} Biaya lain-lain : ${moneyCell(project.requestOtherCost)}</p>
                        <div class="black-total">Total Biaya Rumah Non Finishing: ${moneyCell(nonFinishingTotal)}</div>

                        <p class="payment-heading">Dengan Skema Pembayaran Cash Tempo Sebagai Berikut :</p>
                        <table class="payment-table">
                            <tbody>
                                <tr><td>Down Payment (DP) ${escapeHtml(project.requestDpPercent)}%</td><td class="center">${moneyCell(requestDp)}</td></tr>
                                <tr><td>Pembayaran Ketika Akan Mulai Pembangunan ${escapeHtml(project.requestStartPercent)}%</td><td class="center">${moneyCell(requestStart)}</td></tr>
                                <tr><td>Pembayaran Teratur Mingguan ${Math.max(100 - project.requestDpPercent - project.requestStartPercent, 0)}% (selama Proses Pembangunan)</td><td class="center">${moneyCell(requestWeeklyTotal)}</td></tr>
                            </tbody>
                        </table>
                        <p class="payment-heading">Skema Pembayaran ${Math.max(100 - project.requestDpPercent - project.requestStartPercent, 0)}% (Setiap Sabtu Selama Pembangunan) :</p>
                        <table class="payment-table">
                            <tbody>
                                ${weeklyRows || `<tr><td>Pembayaran Teratur Mingguan</td><td class="center">${baseWeeklyLabel}</td></tr>`}
                            </tbody>
                        </table>
                        <p class="price-note">Harga Akan Selalu Naik 5% Pertahun !!</p>
                    </main>
                    ${
                        hasFinishing
                            ? `<main class="page">
                                <p class="request-title">Biaya Finishing / Perubahan Desain :</p>
                                <table class="finishing-table">
                                    <tbody>
                                        ${finishingRows}
                                    </tbody>
                                </table>
                                <hr class="rule">
                                <p class="total-line">Total biaya finishing / perubahan desain : ${moneyCell(project.finishingItemsTotal)}</p>
                                <p class="total-line">Biaya ongkos kirim material finishing: ${moneyCell(project.finishingShippingCost)}</p>
                                <p class="total-line">Total keseluruhan biaya non finishing : ${moneyCell(nonFinishingTotal)} Biaya lain-lain : ${moneyCell(project.finishingOtherCost)}</p>
                                <div class="black-total">Total Biaya Rumah Sampai Finishing: ${moneyCell(project.total)}</div>
                                <p class="payment-heading">Dengan Skema Pembayaran Cash Tempo Sebagai Berikut :</p>
                                <table class="payment-table">
                                    <tbody>
                                        <tr><td>Down Payment (DP) ${escapeHtml(project.finishingDpPercent)}%</td><td class="center">${moneyCell(finishingDp)}</td></tr>
                                        <tr><td>Pembayaran Teratur Mingguan ${Math.max(100 - project.finishingDpPercent, 0)}% (selama Proses Finishing)</td><td class="center">${moneyCell(finishingWeeklyTotal)}</td></tr>
                                        <tr><td>Angsuran finishing ${escapeHtml(project.finishingInstallments)} x</td><td class="center">${finishingWeeklyLabel}</td></tr>
                                    </tbody>
                                </table>
                                <p class="price-note">Harga Akan Selalu Naik 5% Pertahun !!</p>
                            </main>`
                            : ''
                    }
                    ${attachmentPages('Denah', project.floorPlanFiles)}
                    ${attachmentPages('Desain / Modul Atap', project.facadeFiles)}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        window.setTimeout(() => printWindow.print(), 250);
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
                masterDataItems={masterDataItems}
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
                            onChange={(event) =>
                                handleSearch(event.target.value)
                            }
                            placeholder="Cari RAB project..."
                            className="pl-9"
                        />
                    </div>
                    <CreateRabDialog masterDataItems={masterDataItems} />
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
                                                                        {status}
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
                        Menampilkan {from} - {to} dari {filteredProjects.length}{' '}
                        data
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
                                <span className="sr-only">Halaman pertama</span>
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
