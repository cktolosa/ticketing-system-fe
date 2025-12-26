<script setup lang="ts" generic="TData, TValue">
import { ref } from 'vue'; 

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import { Card, CardContent } from '@/components/ui/card';

import { valueUpdater } from '@/components/ui/table/utils';
import type { 
    ColumnDef, 
    ColumnFiltersState,
    SortingState, 
} from '@tanstack/vue-table';
import {
    FlexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel, 
    useVueTable,
} from '@tanstack/vue-table'; 
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'; 

const props = defineProps<{
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}>(); 

const sorting = ref<SortingState>([]); 
const columnFilters = ref<ColumnFiltersState>([]);
const table = useVueTable({
    get data() { return props.data },
    get columns() { return props.columns },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
    onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
        get sorting() { return sorting.value },
        get columnFilters() { return columnFilters.value },
    },
}); 
</script>

<template>
    <div>
        <div class="flex items-center py-4">
            <Input 
                class="max-w-full" 
                placeholder="Filter ticket title"
                :model-value="table.getColumn('title')?.getFilterValue() as string"
                @update:model-value="table.getColumn('title')?.setFilterValue($event)" 
            />
        </div>

        <div class="block lg:hidden space-y-3">
            <template v-if="table.getRowModel().rows?.length">
                <Card
                    v-for="row in table.getRowModel().rows"
                    :key="row.id"
                    class="text-sm p-5"
                >
                    <CardContent class="grid grid-cols-2 *:p-3 *:border-b">
                        <template v-for="cell in row.getVisibleCells()" :key="cell.id">
                            <div class="text-muted-foreground capitalize">
                                {{ typeof cell.column.columnDef.header === 'string' 
                                    ? cell.column.columnDef.header 
                                    : cell.column.id 
                                }}
                            </div>
                            <div>
                                <FlexRender
                                    :render="cell.column.columnDef.cell"
                                    :props="cell.getContext()"
                                />
                            </div>
                        </template>
                    </CardContent>
                </Card>
            </template>
            <Card v-else>
                <CardContent class="py-8 text-center">
                    No results.
                </CardContent>
            </Card>
        </div>

        <div class="hidden lg:block border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                        <TableHead v-for="header in headerGroup.headers" :key="header.id">
                            <FlexRender
                                v-if="!header.isPlaceholder" 
                                :render="header.column.columnDef.header"
                                :props="header.getContext()"
                            />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="table.getRowModel().rows?.length">
                        <TableRow
                            v-for="row in table.getRowModel().rows" 
                            :key="row.id"
                        >
                            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                                <FlexRender 
                                    :render="cell.column.columnDef.cell" 
                                    :props="cell.getContext()" 
                                />
                            </TableCell>
                        </TableRow>
                    </template>
                    <template v-else>
                        <TableRow>
                            <TableCell :colspan="columns.length" class="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    </template>
                </TableBody>
            </Table>
        </div>
        <div class="flex flex-col sm:flex-row p-4 gap-3 items-center justify-between">
            <div class="text-sm text-muted-foreground">
                Displaying total of {{ table.getFilteredRowModel().rows.length }} row(s).
            </div>
            <div class="flex items-center justify-end space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    :disabled="!table.getCanPreviousPage()"
                    @click="table.previousPage()"
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    :disabled="!table.getCanNextPage()"
                    @click="table.nextPage()"
                >
                    Next
                </Button>
            </div>
        </div>
    </div>
</template>