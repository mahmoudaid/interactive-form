/*
* Author: Mahmoud Eid.
* Description: Interactive form.
* Browsers the project was checked: Google Chrome, Mozilla Firefox, Safari.
*/

/*globals $:false */
/*jslint node: true */

'use strict';

var $color = $('#color');
var totalActivitiesPrice = 0;

// Focus to the first text field.
$("form input").first().focus();

// Wrap all select menus with div.
$( "select" ).wrap( "<div class='styled-select'></div>" );

/*
* Add other title if Job role equal other.
*/
function otherJobRole() {
	var $jobRole = $('#title');
	var $otherTitleInput = '<div id="other-title"><input type="text" placeholder="Your Title"></div>';

	$jobRole.on("change", function () {
		// Remove otherTitleInput if jobRole value not equal other
		$('#other-title').remove();
		// Check if job role equal other
		if($(this).val() === 'other'){
			$jobRole.parent().parent().append($otherTitleInput);
			$('#other-title input').focus();
		}
	});
}
otherJobRole();

/*
* Change colors depend on T-shirt design selection.
*/
function shirtInfo() {
	var $design = $('#design');
	// jsPuns Colors Options
	var jsPunsColorsOptions  = '<option value="cornflowerblue">Cornflower Blue</option>';
	jsPunsColorsOptions += '<option value="darkslategrey">Dark Slate Grey</option>';
    jsPunsColorsOptions += '<option value="gold">Gold</option>';
    // heart Js Colors Options
    var heartJsColorsOptions = '<option value="tomato">Tomato</option>';
    heartJsColorsOptions += '<option value="steelblue">Steel Blue</option>'; 
    heartJsColorsOptions += '<option value="dimgrey">Dim Grey</option>';
    // Please select T-shirt option
    var pleaseSelectShirtOption = '<option><-- Please select a T-shirt theme</option>';
    $('#colors-js-puns').hide();
    // Remove all color options and add you should select design first as an option with no value.
	$color.html(pleaseSelectShirtOption);
	$design.on("change", function () {
		// check selected design theme
		if($design.val() === 'js puns'){
			$color.html(jsPunsColorsOptions);
			$('#colors-js-puns').show();
			styleColorSelectList();
		}else if($design.val() === 'heart js'){
			$color.html(heartJsColorsOptions);
			$('#colors-js-puns').show();
			styleColorSelectList();
		}else{
			$color.html(pleaseSelectShirtOption);
			$('#colors-js-puns').hide();
		}
	});
	// Change color select list style, this is optional
	// Comment the below line if you don't need it.
	$color.on("change", styleColorSelectList);
}
shirtInfo();

/*
* Optional function
* change the color of select list to the color of selected value.
*/
function styleColorSelectList() {
	var styles = {
      background : "url(img/new_arrow.jpg) no-repeat right "+$color.val()+"",
      border: "1px solid "+$color.val()+"",
    };
	$color.parent().css( styles );
	$color.css("color", "#fff");
}

/*
* Register for activities.
* Check if user check or uncheck each activity.
* Call Similar activites for current activity same date and disable it if user check current activity.
* Or enable it if user uncheck current acitivity.
*/
function registerForActivities() {
	$('.activities input').on("change", function () {
		var currentActivityText = $(this).parent().text();
		var data = currentActivityText.split(/[—]|[,]/g);
		var date = data[1].trim();
		var amount = parseInt(data[data.length - 1].trim().replace('$', ''));
		if(this.checked){
			// Disable similar checkboxes in same date.
			similarActivitiesDate(currentActivityText, date, 'disable');
			// Add activity price to total activaties price
			calculateActivities(amount, 'add');
		}else if(!this.checked){
			// Remove disable attribute for similar checkboxes in same date.
			similarActivitiesDate(currentActivityText, date, 'enable');
			// remove activity price to total activaties price
			calculateActivities(amount, 'remove');
		}
	});
}
registerForActivities();

/*
* This function called by registerForActivities() function.
* Search for similar activities.
* parameters: currentActivityText, date, status
*/
function similarActivitiesDate(currentActivityText, date, status) {
	// Loop through all activities
	$('.activities label').each(function (index) {
		// Check if activity match date parameter, currentActivityText not equal current one
		// And status parameter equal disable.
		if($(this).text().match(date) && currentActivityText !== $(this).text() && status === 'disable'){
			// Disable checkbox input.
			$(this).children('input').attr('disabled', 'disabled');
			// change color of text.
			$(this).css('color', '#859daa');
		}else if($(this).text().match(date) && currentActivityText !== $(this).text() && status === 'enable'){
			// Remove disabled attribute.
			$(this).children('input').removeAttr('disabled');
			// Back to default text color.
			$(this).css('color', '');
		}
	});
}


/*
* This function called by registerForActivities() function.
* Calculate checked activities.
* And append total to activities fieldset.
*/
function calculateActivities(amount, operation) {
	// Add amount to current amount if operation equal add
	// Or subtract it if operation equal remove.
	if(operation === 'add'){
		totalActivitiesPrice += amount;
	}else if(operation === 'remove'){
		totalActivitiesPrice -= amount;
	}
	// Append total to activities fieldset
	var $total = '<div class="total">Total: $'+totalActivitiesPrice+'</div>';
	$('.activities .total').remove();
	if(totalActivitiesPrice > 0){
		$('.activities').append($total);
	}
}


/*
* Show payment method depend on user selection.
*/
function paymentInfo() {
	var $payment = $('#payment'); 
	$('#credit-card').hide();
	$('div p:contains("PayPal")').hide();
	$('div p:contains("Bitcoin")').hide();

	$payment.on("change", function () {
		$('#credit-card').hide();
		$('div p:contains("PayPal")').hide();
		$('div p:contains("Bitcoin")').hide();

		if($(this).val() === 'credit card'){
			$('#credit-card').show();
		}else if($(this).val() === 'paypal'){
			$('div p:contains("PayPal")').show();
		}else if($(this).val() === 'bitcoin'){
			$('div p:contains("Bitcoin")').show();
		}
	});
}
paymentInfo();


/*
* Form Validation.
* Make sure all fields match all validation rules before submit the form.
*/
function formValidation() {
	$("form").submit(function(e){
		var $originalColor = '#000';
		var $validationColor = '#884c5f';
		var notValid = 0;

		// Validate name field
		var $name = $('#name');
		var $nameLabel = $('label[for=name]');
		$nameLabel.text('Name:');
		$nameLabel.css('color', $originalColor);

		if(!$name.val()){
			$nameLabel.text('Name: (Please provide your name)');
			$nameLabel.css('color', $validationColor);
			notValid++;
		}

		// Validate email field
		var $email = $('#mail');
		var $emailLabel = $('label[for=mail]');
		$emailLabel.text('Email:');
		$emailLabel.css('color', $originalColor);
		// Check if valid email format 
		if(!validateEmail($email.val())){
			$emailLabel.text('Email: (Please provide a vaild email address)');
			$emailLabel.css('color', $validationColor);
			notValid++;
		}

		// Validate pick a T-shirt
		$('.shirt-validation').remove();
		if($('#design').val() === 'Select Theme') {
			$('.shirt legend').after('<label class="shirt-validation">Don\'t forget to pick a T-shirt</label>');
			$('.shirt-validation').css('color', $validationColor);
			notValid++;
		}

		// Validate activites at least one activity is checked
		$('.activites-validation').remove();
		if($('input[type="checkbox"]:checked').length < 1) {
			$('.activities legend').after('<label class="activites-validation">Please select an Activity</label>');
			$('.activites-validation').css('color', $validationColor);
			notValid++;
		}

		// Validate payment option
		$('.payment-validation').remove();
		if($('#payment').val() === 'select_method') {
			$('label[for="payment"]').before('<label class="payment-validation">Payment option must be selected</label>');
			$('.payment-validation').css('color', $validationColor);
			notValid++;
		}

		// Validate credit card cc-num
		var $cardNumber = $('#cc-num');
		var $cardNumberLabel = $('label[for=cc-num]');
		$cardNumberLabel.css('color', $originalColor);
		if($('#payment').val() === 'credit card' && !validateCardNumber($cardNumber) ){
			$cardNumberLabel.css('color', $validationColor);
			notValid++;
		}

		// Validate credit card zip code
		var $zip = $('#zip');
		var $zipLabel = $('label[for=zip]');
		$zipLabel.css('color', $originalColor);
		if($('#payment').val() === 'credit card' && !$zip.val()){
			$zipLabel.css('color', $validationColor);
			notValid++;
		}

		// Validate credit card cvv
		var $cvv = $('#cvv');
		var $cvvLabel = $('label[for=cvv]');
		$cvvLabel.css('color', $originalColor);
		if($('#payment').val() === 'credit card' && $cvv.val().length !== 3 || isNaN(parseInt($cvv.val())) ){
			$cvvLabel.css('color', $validationColor);
			notValid++;
		}
		
		// Check if notValid fields are greater than 0 stop form submit
		if(notValid > 0){
			e.preventDefault();
		}
    });
}
formValidation();

/*
* Validate email format by regular expretion.
*/
function validateEmail(elementValue){        
   var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  
   return emailPattern.test(elementValue);   
 }


/*
* Validate credit card number format.
* Call validateCreditCard in external plugin:
* PawelDecowski-jquery-creditcardvalidator
* Return true or false.
*/
function validateCardNumber($cardNumber) {
 	var valid;
 	$($cardNumber).validateCreditCard(function(result)
	{
		valid = result.valid;
	});
	return valid;
}