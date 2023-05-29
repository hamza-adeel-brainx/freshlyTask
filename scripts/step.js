$(document).ready(function () {

  $("#pageSteps").steps({
    headerTag: "h3",
    bodyTag: "section",
    transitionEffect: "fade",
    titleTemplate: '<span class="step"></span> <span class="title">#title#</span>'
  });

  $("[data-step-target='plan-step']").on("click", function () {

    $("#pageSteps").steps("setStep", 1);
  });
});