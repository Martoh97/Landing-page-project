// Form elements
const form = document.querySelector('.form');
const inputs = document.querySelectorAll('.input');
const radioButtons = document.querySelectorAll('.radio--btn');
const textarea = document.querySelector('textarea');
const checkbox = document.querySelector('input[type="checkbox"]');
const toast = document.getElementById('toast');

// Validation patterns
const patterns = {
  firstName: /^[a-zA-Z]{2,}$/,
  lastName: /^[a-zA-Z]{2,}$/,
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
};

// Error messages
const errorMessages = {
  firstName: 'Please enter a valid first name (minimum 2 characters, letters only)',
  lastName: 'Please enter a valid last name (minimum 2 characters, letters only)',
  email: 'Please enter a valid email address',
  message: 'Please enter your message (minimum 10 characters)',
  queryType: 'Please select a query type',
  consent: 'Please accept the terms to continue'
};

// Handle radio button selection
radioButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove selected class from all buttons
    radioButtons.forEach(btn => btn.classList.remove('selected'));
    // Add selected class to clicked button
    button.classList.add('selected');
    // Check the radio input inside the button
    const radio = button.querySelector('input[type="radio"]');
    radio.checked = true;
  });
});

// Add error state
const addError = (element, message) => {
  // Remove any existing error states
  removeError(element);
  
  // Add error class
  element.classList.add('error');
  
  // Create and add error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-state';
  errorDiv.textContent = message;
  
  // Insert error message after the element
  if (element.closest('.input-row')) {
    element.closest('.input-row').appendChild(errorDiv);
  }
};

// Remove error state
const removeError = (element) => {
  element.classList.remove('error');
  const errorDiv = element.closest('.input-row').querySelector('.error-state');
  if (errorDiv) {
    errorDiv.remove();
  }
};

// Validate individual field
const validateField = (field, value) => {
  if (patterns[field]) {
    return patterns[field].test(value);
  }
  return true;
};

// Show toast notification
const showToast = () => {
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
};

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let isValid = true;

  // Validate text inputs
  inputs.forEach(input => {
    const field = input.id;
    if (!validateField(field, input.value.trim())) {
      isValid = false;
      addError(input, errorMessages[field]);
    } else {
      removeError(input);
    }
  });

  // Validate radio buttons
  const queryType = form.querySelector('input[type="radio"]:checked');
  if (!queryType) {
    isValid = false;
    addError(radioButtons[0], errorMessages.queryType);
  }

  // Validate textarea
  if (textarea.value.trim().length < 10) {
    isValid = false;
    addError(textarea, errorMessages.message);
  } else {
    removeError(textarea);
  }

  // Validate checkbox
  if (!checkbox.checked) {
    isValid = false;
    addError(checkbox, errorMessages.consent);
  } else {
    removeError(checkbox);
  }

  // If form is valid, submit and show toast
  if (isValid) {
    // Create form data object
    const formData = {
      firstName: form.querySelector('#firstName').value,
      lastName: form.querySelector('#lastName').value,
      email: form.querySelector('#email').value,
      queryType: queryType.id,
      message: textarea.value,
      consent: checkbox.checked
    };

    // Log form data (replace with actual submission)
    console.log('Form submitted:', formData);
    
    // Show success toast
    showToast();
    
    // Reset form
    form.reset();
    radioButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Remove any remaining error states
    document.querySelectorAll('.error').forEach(element => {
      removeError(element);
    });
  }
});

// Real-time validation for inputs
inputs.forEach(input => {
  input.addEventListener('input', () => {
    if (input.value.trim()) {
      if (!validateField(input.id, input.value.trim())) {
        addError(input, errorMessages[input.id]);
      } else {
        removeError(input);
      }
    } else {
      removeError(input);
    }
  });
});

// Real-time validation for textarea
textarea.addEventListener('input', () => {
  if (textarea.value.trim()) {
    if (textarea.value.trim().length < 10) {
      addError(textarea, errorMessages.message);
    } else {
      removeError(textarea);
    }
  } else {
    removeError(textarea);
  }
});

// Handle checkbox changes
checkbox.addEventListener('change', () => {
  if (!checkbox.checked) {
    addError(checkbox, errorMessages.consent);
  } else {
    removeError(checkbox);
  }
});