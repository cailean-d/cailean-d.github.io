
jQuery(document).ready(function ($) {

  calc_finance_loan_consider_result('wp_calc_finance_0');

jQuery("#wp_calc_finance_0 .wp-calc-finance-contract input:text, #wp_calc_finance_0 .wp-calc-finance-contract select").on('keyup', function(){
    calc_finance_loan_consider_result("wp_calc_finance_0");
    if (jQuery('#wp_calc_finance_0 .table_data').html().trim().length>0)
      calc_finance_loan_schedule('wp_calc_finance_0');
});

jQuery("#wp_calc_finance_0 .wp-calc-finance-contract .btn-switcher li").on('click', function(){
    calc_finance_loan_consider_result("wp_calc_finance_0");
    if (jQuery('#wp_calc_finance_0 .table_data').html().trim().length>0)
      calc_finance_loan_schedule('wp_calc_finance_0');
});
});


jQuery( function() {
    jQuery( "#wp_calc_finance_0 .wp-calc-finance-slider-credit" ).show();
    jQuery( "#wp_calc_finance_0 .wp-calc-finance-slider-credit" ).slider({
	    range: "min",
	    min: 0,
	    max: 100000,
//	    step: 1,
	    value: 100,
	    slide: function(event, ui) {
        	jQuery( "#wp_calc_finance_0 .wp-calc-finance-slider-credit" ).prevAll("input[type=text]").val(ui.value);
        	if (typeof calc_finance_recalc_0 === 'function') {
        		calc_finance_recalc_0();
        	}
        }
    });
    jQuery( "#wp_calc_finance_0 .wp-calc-finance-slider-credit" ).prevAll("input[type=text]").change(function() {
    	jQuery( "#wp_calc_finance_0 .wp-calc-finance-slider-credit" ).slider("value", jQuery(this).val().replace(/[^0-9\.]/g,''));
    });
  });
