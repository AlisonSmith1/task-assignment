const { fakerZH_TW: faker } = require('@faker-js/faker');

module.exports = () => {
  const data = {
    tasks: [],
    drivers: [],
  };

  const priorities = ['High', 'Medium', 'Low'];

  // 1. Tasks
  //   for (let i = 0; i < 10; i++) {
  //     data.tasks.push({
  //       id: (i + 1).toString(),
  //       title: `訂單 ${String.fromCharCode(65 + i)}`,
  //       priority: faker.helpers.arrayElement(priorities),
  //       createdAt: faker.date.past().getTime(),
  //       id: (i + 1).toString(),
  //     });
  //   }
  for (let i = 0; i < 20; i++) {
    data.tasks.push({
      id: (i + 1).toString(),
      title: `訂單 ${String.fromCharCode(65 + (i % 26))}`,
      priority: faker.helpers.arrayElement(priorities),
      status: `狀態 ${faker.number.int({ min: 1, max: 3 })}`,
      createdAt: faker.date.past().getTime(),
      deadline: faker.date.future().getTime(),
      overrideHistory: [],
      description: faker.lorem.sentence(),
    });
  }

  // 2. Drivers
  for (let i = 0; i < 5; i++) {
    data.drivers.push({
      id: (i + 1).toString(),
      name: faker.person.fullName(),
      tasks: [],
    });
  }

  return data;
};
