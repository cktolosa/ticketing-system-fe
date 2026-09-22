import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

import type { Status } from '@/modules/tickets/types';
import type { User } from '@/modules/users';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { useDepartmentStore } from '@/stores/department';
import { usePriorityStore } from '@/stores/priority';
import { useUserStore } from '@/stores/user';

export function useTicketFormData() {
  const auth = useAuthStore();

  const priorityStore = usePriorityStore();
  const userStore = useUserStore();
  const departmentStore = useDepartmentStore();

  const { departments } = storeToRefs(departmentStore);
  const { priorities } = storeToRefs(priorityStore);
  const users = ref<User[]>([]);
  const admins = ref<User[]>([]);
  const statuses = ref<Status[]>([]);
  const role = auth.user?.role?.name;

  onMounted(async () => {
    const fetches = [priorityStore.fetchPriorities(), departmentStore.fetchDepartments()];

    if (role !== 'customer') {
      fetches.push(api.get('statuses').then((res) => (statuses.value = res.data.data)));
    }

    if (role === 'superadmin') {
      await userStore.fetchUsers();
      users.value = userStore.users;
    } else if (role === 'admin') {
      try {
        const dept = await departmentStore.fetchDepartmentbyId(String(auth.user?.department?.id));
        users.value = dept.users;
      } catch (error) {
        console.error('error:', error);
      }
    }
    await Promise.all(fetches);
  });

  async function onDepartmentChange(departmentId: string) {
    const department = await departmentStore.fetchDepartmentbyId(departmentId);
    admins.value = (department.users ?? []).filter((user: User) => user.role?.name !== 'customer');
  }

  return { departments, priorities, statuses, users, admins, auth, role, onDepartmentChange };
}
