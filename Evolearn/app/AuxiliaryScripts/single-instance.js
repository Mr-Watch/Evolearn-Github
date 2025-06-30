const instance = window.localStorage.getItem("_instance_");
if (instance === null) {
  window.addEventListener("beforeunload", () => {
    window.localStorage.removeItem("_instance_");
  });

  window.localStorage.setItem("_instance_", "running");
} else {
  document.title = "Error - Unpermitted Application Instance";
  document.write(
    `<style>
      body{
        font-size: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      h1{
        top: 50vh;
        position: relative;
      }
    </style>
    <h1>Only one instance of the application is allowed to run at a time</h1>`
  );
  window.stop();
}
