<template>
  <div class="center">
    <s-table>
      <template #thead>
        <s-tr>
          <s-th> Name </s-th>
          <s-th> Email </s-th>
          <s-th> Id </s-th>
        </s-tr>
      </template>
      <template #tbody>
        <s-tr v-for="(tr, i) in users" :key="i" :data="tr">
          <s-td
            edit
            @click=";(edit = tr), (editProp = 'name'), (editActive = true)"
          >
            {{ tr.name }}
          </s-td>
          <s-td
            edit
            @click=";(edit = tr), (editProp = 'email'), (editActive = true)"
          >
            {{ tr.email }}
          </s-td>
          <s-td>
            {{ tr.id }}
          </s-td>
        </s-tr>
      </template>
    </s-table>

    <s-dialog v-model="editActive">
      <template #header> Change Prop {{ editProp }} </template>
      <s-input
        v-if="editProp == 'email'"
        v-model="edit[editProp]"
        block
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
import { ref } from 'vue'

type User = {
  id: number | string
  name: string
  username: string
  email: string
  website: string
}

const edit = ref<Pick<User, 'name' | 'email'>>({ name: '', email: '' })
const editProp = ref<keyof typeof edit.value>()
const editActive = ref<boolean>(false)

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
</script>
