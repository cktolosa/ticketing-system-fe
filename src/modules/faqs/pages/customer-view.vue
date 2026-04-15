<script setup lang="ts">
import { FolderIcon, SearchIcon, XIcon } from 'lucide-vue-next';
import { computed, ref } from 'vue';

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

const faqs = [
  {
    department: 'AIT',
    items: [
      {
        id: 'a1',
        title: 'How do I reset my password?',
        content:
          'Go to the login page and click "Forgot Password". Enter your company email and follow the instructions sent to your inbox.',
      },
      {
        id: 'a2',
        title: 'What should I do if I suspect a phishing email?',
        content:
          'Do not click any links or download attachments. Report it immediately to the IT Security team via the helpdesk and delete the email.',
      },
      {
        id: 'a3',
        title: 'How often should I change my password?',
        content:
          'Company policy requires password changes every 90 days. You will receive a reminder 7 days before expiration.',
      },
      {
        id: 'a4',
        title: 'Can I use new personal devices to access company systems?',
        content: 'Yes, but only through the company VPN and with prior approval from IT Security.',
      },
      {
        id: 'a5',
        title: 'What is the policy on sharing login credentials?',
        content:
          'Sharing login credentials is strictly prohibited. Each employee must use their own account.',
      },
    ],
  },
  {
    department: 'Team Banana',
    items: [
      {
        id: 't1',
        title: 'How do I report a bug in the system?',
        content:
          'Submit a ticket through the helpdesk portal with a detailed description and steps to reproduce.',
      },
      {
        id: 't2',
        title: 'How long does it take to resolve a reported bug?',
        content:
          'Critical bugs within 24 hours, major bugs within 3 days, and minor bugs within 7 days.',
      },
      {
        id: 't3',
        title: 'How do I request a new feature?',
        content:
          'Submit a feature request ticket. The dev team reviews all requests during monthly sprint planning.',
      },
      {
        id: 't4',
        title: 'Why is the system slow or unresponsive?',
        content:
          'This may be due to scheduled maintenance or high server load. Check the system status page for announcements.',
      },
      {
        id: 't5',
        title: 'How do I know if a system update is scheduled?',
        content:
          'Updates are announced at least 48 hours in advance via company email and the system status page.',
      },
    ],
  },
];

const search = ref('');

const filtered = computed(() => {
  const query = search.value.trim().toLowerCase();

  if (!query) return faqs;

  return faqs
    .map((group) => ({
      ...group,
      items: group.items.filter((faq) => faq.title.toLowerCase().includes(query)),
    }))
    .filter((group) => group.items.length > 0);
});
</script>

<template>
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
