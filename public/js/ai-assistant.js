/* eslint-disable */
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const aiAssistantIcon = document.getElementById('aiAssistantIcon');
  const aiAssistantChat = document.getElementById('aiAssistantChat');
  const aiAssistantClose = document.getElementById('aiAssistantClose');
  const aiMessages = document.getElementById('aiMessages');
  const aiUserInput = document.getElementById('aiUserInput');
  const aiSendButton = document.getElementById('aiSendButton');

  // Toggle chat visibility
  aiAssistantIcon.addEventListener('click', function() {
    aiAssistantChat.classList.toggle('active');
  });

  // Close chat
  aiAssistantClose.addEventListener('click', function() {
    aiAssistantChat.classList.remove('active');
  });

  // Send message on button click
  aiSendButton.addEventListener('click', sendMessage);

  // Send message on Enter key
  aiUserInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Function to send message
  function sendMessage() {
    const message = aiUserInput.value.trim();
    if (message) {
      // Add user message to chat
      addMessage(message, 'user');
      
      // Clear input
      aiUserInput.value = '';
      
      // Show loading indicator
      const loadingIndicator = addLoadingIndicator();
      
      // Send query to AI endpoint
      fetch('/api/v1/tours/ai-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: message }),
      })
      .then(response => response.json())
      .then(data => {
        // Remove loading indicator
        loadingIndicator.remove();
        
        // Add bot response to chat
        // Updated to handle the correct response structure from backend
        if (data.data && data.data.response) {
          // General AI response
          addMessage(data.data.response, 'bot');
        } else if (data.data && data.data.tour) {
          // Detailed tour information
          const tour = data.data.tour;
          const tourInfo = `
            <strong>${tour.name}</strong><br>
            ${tour.description}<br>
            <strong>Difficulty:</strong> ${tour.difficulty}<br>
            <strong>Duration:</strong> ${tour.duration} days<br>
            <strong>Price:</strong> $${tour.price}<br>
            <strong>Rating:</strong> ${tour.ratingsAverage}/5 (${tour.ratingsQuantity} reviews)<br>
            <strong>Max Group Size:</strong> ${tour.maxGroupSize} people<br>
            <strong>Location:</strong> ${tour.startLocation}<br>
            <a href="/tour/${tour.slug}" class="btn btn--primary btn--small" style="margin-top: 10px;">View Details</a>
          `;
          addMessage(tourInfo, 'bot');
        } else if (data.data && data.data.tours && data.data.tours.length > 0) {
          // List of tours
          let tourList = '<strong>Here are some matching tours:</strong><br><ul>';
          data.data.tours.forEach(tour => {
            tourList += `<li>${tour.name} - $${tour.price} (${tour.ratingsAverage}/5)<br>
              <a href="/tour/${tour.slug}" class="btn btn--primary btn--small" style="margin-top: 5px;">View Details</a></li>`;
          });
          tourList += '</ul>';
          addMessage(tourList, 'bot');
        } else {
          // General response
          addMessage(data.message || "I couldn't find any information matching your query.", 'bot');
        }
      })
      .catch(error => {
        // Remove loading indicator
        loadingIndicator.remove();
        
        // Show error message
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        console.error('AI Assistant Error:', error);
      });
    }
  }

  // Function to add message to chat
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('ai-assistant__message');
    messageDiv.classList.add(`ai-assistant__message--${sender}`);
    
    // Handle HTML content properly
    if (sender === 'bot') {
      messageDiv.innerHTML = text;
    } else {
      messageDiv.textContent = text;
    }
    
    aiMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  // Function to add loading indicator
  function addLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('ai-assistant__message', 'ai-assistant__message--bot');
    loadingDiv.innerHTML = '<div class="ai-assistant__loading"></div> Thinking...';
    aiMessages.appendChild(loadingDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
    return loadingDiv;
  }

  // Close chat when clicking outside
  document.addEventListener('click', function(e) {
    if (!aiAssistantChat.contains(e.target) && e.target !== aiAssistantIcon) {
      aiAssistantChat.classList.remove('active');
    }
  });
});