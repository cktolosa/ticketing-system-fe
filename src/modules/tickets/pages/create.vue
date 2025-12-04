<script setup lang="ts">
import { ref, watch } from "vue"; 

import * as z from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm, Form, Field as VeeField } from "vee-validate";
import type { FieldBindingObject } from "vee-validate";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from '@/components/ui/textarea'; 
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
    FieldLegend,
    FieldDescription,
} from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"; 
import { 
    Card, 
    CardContent,
} from '@/components/ui/card';

import { 
    X,
    FileText,
    Image,
    Video,
    Upload, 
} from "lucide-vue-next";

const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return Image;
    if (fileType.startsWith("video/")) return Video;
    if (fileType === "application/pdf") return FileText;
    return FileText;
};

const handleFileChange = (event: Event, field: FieldBindingObject<File[]>) => {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []); 
    const combined = [...(field.value || []), ...files]; 

    if (combined.length > 5) {
        field.onChange(combined.slice(0, 5));
    } else {
        field.onChange(combined);
    }
}; 

const removeFile = (index: number, field: FieldBindingObject<File[]>) => {
    const files = field.value || [];
    const filtered = files.filter((_file: File, i: number) => i !== index);
    field.onChange(filtered);
};

const isUnassigned = ref<boolean>(false); 
watch(isUnassigned, (checked) => {
    if (checked) {
        setFieldValue("admin_id", undefined);
    }
});

type Employee = {
    id: number, 
    name: string
}; 
const employees = ref<Employee[]>([
    { id: 1, name: "Jose Reyes" },
    { id: 2, name: "Carlos Mendoza" },
    { id: 3, name: "Ana Marie Garcia" }
]); 

type Priority = {
    id: number, 
    name: string
}; 
const priorities = ref<Priority[]>([
    { id: 1, name: "Low" },
    { id: 2, name: "Medium" },
    { id: 3, name: "High" }
]); 

type Department = {
    id: number, 
    name: string
}; 
const departments = ref<Department[]>([
    { id: 1, name: "Team Banana" },
    { id: 2, name: "AIT" },
    { id: 3, name: "HRAD" },
    { id: 4, name: "Equinox" },
    { id: 5, name: "QA" },
    { id: 6, name: "Crowd Works" }
]); 

type Admin = {
    id: number, 
    name: string
}; 
const admins = ref<Admin[]>([
    { id: 1, name: "Juan Dela Cruz" },
    { id: 2, name: "Juana Rodriguez" },
    { id: 3, name: "Ruby Velasquez" }
]); 

const ticketSchema = z.object ({
    employee_id: z.number()
        .min(1, "Please select an employee."),
    priority_id: z.number()
        .min(1, "Please select a priority."), 
    department_id: z.number()
        .min(1, "Please select a department."),
    admin_id: z.number()
        .min(1, "Please select an admin or check the leave unassigned option.")
        .optional(),
    title: z.string()
        .min(10, "Title must be at least 10 characters.")
        .max(50, "Title must not exceed 50 characters."), 
	description: z.string()
        .min(20, "Description must be at least 20 characters.")
        .max(500, "Description must not exceed 500 characters."), 
    attachments: z.array(z.instanceof(File))
        .max(5, "You can upload up to 5 files only.")
        .refine(
            files => files.every(file => file.size <= 10_485_760), 
            "Each file must be less than 10MB."
        )
        .refine(
            files => files.every(file => {
                const isImage = file.type.startsWith("image/");
                const isVideo = file.type.startsWith("video/");
                const isPDF = file.type === "application/pdf";
                return isImage || isVideo || isPDF; 
            }), 
            "Only image, video, and PDF files are allowed."
        )
        .optional(), 
}).refine((data) => {
    if (!isUnassigned.value && !data.admin_id) {
        return false;
    }
    return true; 
}, {
    message: "Please select an admin or check the leave unassigned option.", 
    path: ["admin_id"]
});

const defaultValues: z.infer<typeof ticketSchema> = {
    employee_id: 0, 
    department_id: 0,
    admin_id: 0,
    priority_id: 0,
    title: "",
    description: "",
    attachments: undefined,
};

const { handleSubmit, setFieldValue, resetForm } = useForm({
    validationSchema: toTypedSchema(ticketSchema),
    initialValues: defaultValues, 
});

const handleCancel = () => {
    resetForm();
    isUnassigned.value = false; 
}; 

const onSubmit = handleSubmit((data) => {
    alert(JSON.stringify({
        ...data, 
        attachments: data.attachments?.map(
            f => ({
                name: f.name,
                size: f.size,
                type: f.type
            })
        )
    }));
    handleCancel(); 
});
</script>

<template>
    <form class="w-full p-5" @submit="onSubmit">
        <FieldGroup>
            <FieldSet>
                <FieldLegend>File a Ticket</FieldLegend>
                <FieldDescription>
                    Provide the details below and we'll get your issue resolved quickly.
                </FieldDescription>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <VeeField
                        v-slot="{ field, errors }" 
                        name="employee_id" 
                    >
                        <Field>
                            <FieldLabel>Employee</FieldLabel>
                            <Select
                                :model-value="field.value"
                                @update:modelValue="field.onChange"
                            >
                                <SelectTrigger :aria-invalid="!!errors.length">
                                    <SelectValue placeholder="Select an employee" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem 
                                        v-for="e in employees"
                                        :key="e.id"
                                        :value="e.id"
                                    >
                                        {{ e.name }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldError :errors="errors" />
                        </Field>
                    </VeeField>

                    <VeeField
                        v-slot="{ field, errors }" 
                        name="priority_id" 
                    >
                        <Field>
                            <FieldLabel>Priority</FieldLabel>
                            <Select
                                :model-value="field.value"
                                @update:modelValue="field.onChange"
                            >
                                <SelectTrigger :aria-invalid="!!errors.length">
                                    <SelectValue placeholder="Select a priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem 
                                        v-for="p in priorities"
                                        :key="p.id"
                                        :value="p.id"
                                    >
                                        {{ p.name }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldError :errors="errors" />
                        </Field>
                    </VeeField>

                    <VeeField
                        v-slot="{ field, errors }" 
                        name="department_id" 
                    >
                        <Field>
                            <FieldLabel>Department</FieldLabel>
                            <Select
                                :model-value="field.value"
                                @update:modelValue="field.onChange"
                            >
                                <SelectTrigger :aria-invalid="!!errors.length">
                                    <SelectValue placeholder="Select a department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem 
                                        v-for="d in departments"
                                        :key="d.id"
                                        :value="d.id"
                                    >
                                        {{ d.name }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldError :errors="errors" />
                        </Field>
                    </VeeField>

                    <VeeField
                        v-slot="{ field, errors }" 
                        name="admin_id" 
                    >
                        <Field>
                            <div class="flex justify-between">
                                <FieldLabel>Admin</FieldLabel>
                                    <div class="flex items-center gap-2">
                                        <Checkbox
                                            id="unassigned"
                                            v-model="isUnassigned"
                                        />
                                        <Label for="unassigned">Leave unassigned</Label>
                                    </div>
                            </div>
                            <Select
                                :model-value="field.value"
                                @update:modelValue="field.onChange"
                                :disabled="isUnassigned"
                            >
                                <SelectTrigger :aria-invalid="!!errors.length">
                                    <SelectValue placeholder="Select an admin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem 
                                        v-for="a in admins"
                                        :key="a.id"
                                        :value="a.id"
                                    >
                                        {{ a.name }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldError :errors="errors" />
                        </Field>
                    </VeeField>
                </div>

                <VeeField
                    v-slot="{ field, errors }" 
                    name="title" 
                >
                    <Field>
                        <FieldLabel :for="field.name">Title</FieldLabel>
                            <Input
                                v-bind="field"
                                type="text"
                                placeholder="Describe the subject of the ticket."
                                :aria-invalid="!!errors.length"
                            />
                            <FieldError :errors="errors" />
                    </Field>
                </VeeField>

                <VeeField
                    v-slot="{ field, errors }" 
                    name="description" 
                >
                    <Field>
                        <FieldLabel :for="field.name">Description</FieldLabel>
                            <Textarea
                                v-bind="field"
                                placeholder="Describe the issue and steps to reproduce."
                                :aria-invalid="!!errors.length"
                            />
                            <FieldError :errors="errors" />
                        </Field>
                </VeeField> 

                <VeeField
                    v-slot="{ field, errors }" 
                    name="attachments" 
                >
                    <Field>
                        <FieldLabel :for="field.name">Attachments</FieldLabel>
                        <FieldDescription>
                            Maximum 5 files. Accepts images, videos, and PDF documents (up to 10MB each).
                        </FieldDescription>
                            <Input
                                :id="`${field.name}-input`"
                                :key="field.value?.length"
                                type="file"
                                multiple
                                accept="application/pdf,image/*,video/*"
                                class="hidden"
                                :disabled="field.value?.length >= 5"
                                @change="(e: Event) => handleFileChange(e, field)"
                            />
                            <Label :for="`${field.name}-input`">
                                <Button
                                    type="button"
                                    variant="outline"
                                    class="w-full justify-start text-left"
                                    :disabled="field.value?.length >= 5"
                                    as-child
                                >
                                    <span>
                                        <Upload class="mr-2 h-4 w-4" />
                                        {{ field.value?.length >= 5 ? 'Maximum files reached' : 'Choose Files' }}
                                    </span>
                                </Button>
                            </Label>

                        <div 
                            v-if="field.value && field.value.length > 0" 
                            class="mt-3 space-y-2"
                        >
                            <Card 
                                v-for="(file, index) in field.value" 
                                :key="`${file.name}-${index}`"
                                :class="file.size > 10485760 ? 'bg-red-50 border-destructive' : ''"
                            >
                                <CardContent class="flex items-center justify-between p-3">
                                    <div class="flex items-center gap-3">
                                        <component 
                                            :is="getFileIcon(file.type)" 
                                            class="h-8 w-8 text-muted-foreground" 
                                        />
                                        <div class="flex flex-col">
                                            <p class="text-sm font-medium truncate">
                                                {{ file.name }}
                                            </p>
                                            <p class="text-xs font-medium truncate">
                                                {{ (file.size / 1048576).toFixed(2) }} MB
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        @click="removeFile(index, field)"
                                    >
                                        <X />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                        <FieldError :errors="errors" />
                    </Field>
                </VeeField> 

                <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                    <Button 
                        type="button"
                        variant="secondary" 
                        @click="handleCancel"
                    >
                        Cancel
                    </Button>
                    <Button type="submit">File Ticket</Button>
                </div>
            </FieldSet>
        </FieldGroup>
    </form>
</template>




