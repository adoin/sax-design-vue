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
          <s-td>
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
    </s-table>
  </div>
</template>

<script lang="ts" setup>
type User = {
  id: number | string
  name: string
  username: string
  email: string
  website: string
}

const users: User[] = [
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
]
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
