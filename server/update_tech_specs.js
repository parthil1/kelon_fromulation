const knex = require('knex')(require('./knexfile').development);

async function updateData() {
  console.log('Starting data update...');
  
  const updates = [
    {
      slug: 'glutathione-effervescent-tablet',
      flavours: 'Orange, Lemon, Watermelon, Strawberry',
      packing_material: 'Tube Pack, HDPE Bottle',
      packing_size: '15 Tab, 20 Tab, 30 Tab',
      shelf_life: '18 Months',
      moq: '2000 Tubes'
    },
    {
      slug: 'acv-effervescent-tablet',
      flavours: 'Green Apple, Natural ACV',
      packing_material: 'Tube Pack',
      packing_size: '15 Tab, 20 Tab',
      shelf_life: '18 Months',
      moq: '3000 Tubes'
    }
  ];

  for (const up of updates) {
    const updated = await knex('products').where({ slug: up.slug }).update(up);
    console.log(`Updated ${up.slug}: ${updated}`);
  }

  process.exit(0);
}

updateData().catch(err => {
  console.error(err);
  process.exit(1);
});
