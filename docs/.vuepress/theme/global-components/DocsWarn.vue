<script lang="ts">
import { defineComponent } from 'vue'

// Retain the legacy documentation tag as a component that renders no content.
export default defineComponent({
  name: 'DocsWarn',
  setup: () => () => null,
})
</script>
