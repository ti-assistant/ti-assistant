// profiler.js - Initialize Cloud Profiler
const profiler = require("@google-cloud/profiler");

profiler.start({}).catch((err) => {
  console.log(`Failed to start profiler: ${err}`);
});
