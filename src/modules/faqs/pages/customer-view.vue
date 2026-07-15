<script setup lang="ts">
import { FolderIcon, SearchIcon, XIcon } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';

import { getErrorMessage, getRolePaths } from '@/lib/utils';

import type { Department } from '@/modules/departments';
import type { Faq } from '@/modules/faqs';
import { faqsApi } from '@/modules/faqs/services';
import { useAuthStore } from '@/stores/auth';

const faqs = ref<Faq[]>([]);
const fetchError = ref('');
const auth = useAuthStore();
const basePath = getRolePaths[auth.user?.role?.name ?? ''];

const fetchFaqs = async (page = 1) => {
  fetchError.value = '';
  try {
    const response = await faqsApi.getAll(page);
    faqs.value = response.data;
  } catch (error) {
    fetchError.value = getErrorMessage(error);
    faqs.value = [];
  }
};

onMounted(fetchFaqs);

const search = ref('');

const filtered = computed(() => {
  const query = search.value.trim().toLowerCase();

  if (!query) return faqs.value;

  return faqs.value.filter((faq) => faq.title.toLowerCase().includes(query));
});

const groupedFaqs = computed(() => {
  return Object.values(
    filtered.value.reduce(
      (groups, faq) => {
        const department = faq.department;

        (groups[department.id] ??= {
          department,
          items: [],
        }).items.push(faq);

        return groups;
      },
      {} as Record<
        number,
        {
          department: Department;
          items: Faq[];
        }
      >
    )
  );
});
</script>

<template>
  <template v-if="fetchError">
    <p class="text-destructive py-5 text-center text-sm">
      {{ fetchError }}
    </p>
  </template>
  <template v-else>
    <div class="space-y-7 p-5">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput v-model="search" placeholder="Search faqs by title..." />
        <InputGroupAddon v-if="search" align="inline-end">
          <InputGroupButton size="icon-xs" @click="search = ''">
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <div v-for="group in groupedFaqs" :key="group.department_id">
        <div class="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <FolderIcon />
          <p>{{ group.department.name }}</p>
        </div>
        <Accordion type="single" collapsible>
          <AccordionItem v-for="faq in group.items" :key="faq.id" :value="String(faq.id)">
            <AccordionTrigger>
              {{ faq.title }}
            </AccordionTrigger>
            <AccordionContent>
              <div class="relative max-h-24 overflow-hidden">
                <div v-dompurify-html="faq.content" class="prose prose-sm w-full max-w-none" />

                <div
                  class="from-background absolute right-0 bottom-0 left-0 h-10 bg-gradient-to-t"
                />
              </div>

              <router-link
                class="text-primary mt-2 inline-block text-sm underline"
                :to="`${basePath}/faqs/${faq.id}`"
              >
                View full article
              </router-link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <p v-if="groupedFaqs.length === 0" class="text-muted-foreground py-5 text-center text-sm">
        No FAQs found.
      </p>
    </div>
  </template>
</template>
