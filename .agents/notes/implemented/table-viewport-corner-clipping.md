# Table viewport corner clipping

The stationary `.s-table` scroll viewport owns the top-left and top-right outer radii. The horizontally translating `.s-table__data-view` has square corners; clipping on that layer must not move the visible outer shape away from the viewport or expose fixed-column backgrounds.

Bottom corners stay square to preserve native horizontal scrollbar painting. When the wrapper provides its own header, that header owns the top radii and its following table viewport stays square.

Verified on the documentation appearance example at scrollLeft 0 and 288: hit-testing one pixel inside each outer top corner resolves outside the table, while header content remains accessible. Fixed columns and the native horizontal scrollbar remain visible. Theme build passed.
