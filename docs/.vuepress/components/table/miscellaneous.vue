<template>
  <div class="center">
    <s-table v-model="selected" multiple>
      <template #header>
        <s-input
          v-model="search"
          block
          type="url"
          input-style="border"
          placeholder="Search"
        />
      </template>
      <template #thead>
        <s-tr>
          <s-th>
            <s-checkbox
              :checked-force="selected.length > 0"
              :indeterminate="selected.length < users.length"
              @change="selected = toggleSelectAll(selected, getSearch)"
            />
          </s-th>
          <s-th sort @click="users = sortData($event, users, 'name')">
            Name
          </s-th>
          <s-th sort @click="users = sortData($event, users, 'email')">
            Email
          </s-th>
          <s-th sort @click="users = sortData($event, users, 'id')"> Id </s-th>
        </s-tr>
      </template>
      <template #tbody>
        <s-tr
          v-for="(tr, i) in getPage(getSearch, page, pageSize)"
          :key="i"
          :data="tr"
          not-click-selected
          open-expand-only-td
        >
          <s-td checkbox>
            <s-checkbox v-model="selected" :value="tr" />
          </s-td>
          <s-td
            edit
            @click=";(edit = tr), (editProp = 'name'), (editActive = true)"
          >
            {{ tr.name }}
          </s-td>
          <s-td>
            {{ tr.email }}
          </s-td>
          <s-td>
            {{ tr.id }}
          </s-td>

          <template #expand>
            <div class="con-content">
              <div>
                <s-avatar>
                  <img :src="`/avatars/avatar-${i + 1}.png`" alt="" />
                </s-avatar>
                <p>
                  {{ tr.name }}
                </p>
              </div>
              <div>
                <s-button type="flat" icon>
                  <i class="bx bx-lock-open-alt" />
                </s-button>
                <s-button type="flat" icon> Send Email </s-button>
                <s-button type="border" color="danger"> Remove User </s-button>
              </div>
            </div>
          </template>
        </s-tr>
      </template>
      <template #footer>
        <s-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7]"
          :total="getSearch.length"
          progress
          infinite
        />
      </template>
    </s-table>

    <s-dialog v-model="editActive">
      <template #header> Change Prop {{ editProp }} </template>
      <s-input
        v-if="editProp == 'email'"
        v-model="edit[editProp]"
        @keypress.enter="editActive = false"
      />
      <s-select
        v-if="editProp == 'name'"
        v-model="edit[editProp]"
        block
        placeholder="Select"
        @change="editActive = false"
      >
        <s-option label="Vuesax" value="Vuesax"> Vuesax </s-option>
        <s-option label="Vue" value="Vuejs"> Vue </s-option>
        <s-option label="Javascript" value="Javascript"> Javascript </s-option>
        <s-option disabled label="Sass" value="Sass"> Sass </s-option>
        <s-option label="Typescript" value="Typescript"> Typescript </s-option>
        <s-option label="Webpack" value="Webpack"> Webpack </s-option>
        <s-option label="Nodejs" value="Nodejs"> Nodejs </s-option>
      </s-select>
    </s-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { getPage, sortData, toggleSelectAll } from 'sax-design-vue'

type User = {
  id: number | string
  name: string
  username: string
  email: string
  website: string
}

const editActive = ref(false)
const edit = ref<Pick<User, 'name' | 'email'>>({ name: '', email: '' })
const editProp = ref<keyof typeof edit.value>()
const search = ref('')
const page = ref(1)
const pageSize = ref(4)
const selected = ref<User[]>([])

const users = ref<User[]>([
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    website: 'hildegard.org',
  },
  {
    id: 2,
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'Shanna@melissa.tv',
    website: 'anastasia.net',
  },
  {
    id: 3,
    name: 'Clementine Bauch',
    username: 'Samantha',
    email: 'Nathan@yesenia.net',
    website: 'ramiro.info',
  },
  {
    id: 4,
    name: 'Patricia Lebsack',
    username: 'Karianne',
    email: 'Julianne.OConner@kory.org',
    website: 'kale.biz',
  },
  {
    id: 5,
    name: 'Chelsey Dietrich',
    username: 'Kamren',
    email: 'Lucio_Hettinger@annie.ca',
    website: 'demarco.info',
  },
  {
    id: 6,
    name: 'Mrs. Dennis Schulist',
    username: 'Leopoldo_Corkery',
    email: 'Karley_Dach@jasper.info',
    website: 'ola.org',
  },
  {
    id: 7,
    name: 'Kurtis Weissnat',
    username: 'Elwyn.Skiles',
    email: 'Telly.Hoeger@billy.biz',
    website: 'elvis.io',
  },
  {
    id: 8,
    name: 'Nicholas Runolfsdottir V',
    username: 'Maxime_Nienow',
    email: 'Sherwood@rosamond.me',
    website: 'jacynthe.com',
  },
  {
    id: 9,
    name: 'Glenna Reichert',
    username: 'Delphine',
    email: 'Chaim_McDermott@dana.io',
    website: 'conrad.com',
  },
  {
    id: 10,
    name: 'Clementina DuBuque',
    username: 'Moriah.Stanton',
    email: 'Rey.Padberg@karina.biz',
    website: 'ambrose.net',
  },
])

const getSearch = computed(() => {
  return users.value.filter((e) =>
    e.name.toLowerCase().includes(search.value.toLowerCase())
  )
})
</script>

<style lang="scss" scoped>
.con-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
    p {
      margin-left: 10px;
    }
  }
}
</style>
