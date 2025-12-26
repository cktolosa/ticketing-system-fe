<script setup lang="ts">
import { Button } from '@/components/ui/button'; 
import { MoreHorizontal } from 'lucide-vue-next';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; 
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="sm">
                <span class="sr-only">Open menu</span>
                <MoreHorizontal class="size-5" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem>View ticket</DropdownMenuItem>
            <DropdownMenuItem>Edit ticket</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>