const fs = require('fs');
const Path = require('path');
const yaml = require('js-yaml')

const createCronTemplate = ({ name, cron }) => ({
   "name": name,
   "on": {
      "schedule": [
         {
            "cron": cron,
         }
      ],
     workflow_dispatch: '',
   },
   "jobs": {
      "publish": {
         "runs-on": "ubuntu-latest",
         "steps": [
            {
               "name": "Checkout code",
               "uses": "actions/checkout@v1",
               "with": {
                  "ref": "master"
               }
            },
            {
               "name": "Use Node.js 12.x",
               "uses": "actions/setup-node@v1",
               "with": {
                  "node-version": "12.x"
               }
            },
            {
               "name": "Run Schedule Publish",
               "run": "node ./packages/studio/scripts/add.js"
            }
         ]
      }
   }
})

module.exports = (function createCronJob() {
   const now = new Date();

   let yamlStr = yaml.dump(createCronTemplate({ name: now.toISOString(), cron: '4 * * * *' }));

   fs.writeFileSync(Path.join(`./.github/workflows/jobs/${now.toISOString()}.yml`), yamlStr, 'utf8');
})();