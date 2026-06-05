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

import { getErrorMessage } from '@/lib/utils';

import { faqsApi } from '..';
import type { Faq } from '../types';

const faqs = ref<Faq[]>([]);
const fetchError = ref('');

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

  if (!query) return faqs;

  return faqs.value
    .map((group) => ({
      ...group,
      items: group.items.filter((faq) => faq.title.toLowerCase().includes(query)),
    }))
    .filter((group) => group.items.length > 0);
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
      <div v-for="group in filtered" :key="group.department">
        <div class="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <FolderIcon />
          <p>{{ group.department }} Department</p>
        </div>
        <Accordion type="single" collapsible>
          <AccordionItem v-for="faq in group.items" :key="faq.id" :value="faq.id">
            <AccordionTrigger>{{ faq.title }}</AccordionTrigger>
            <AccordionContent>
              {{ faq.content }}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <p v-if="filtered.length === 0" class="text-muted-foreground py-5 text-center text-sm">
        No FAQs found.
      </p>
    </div>
  </template>
</template>
