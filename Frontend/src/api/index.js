export async function sendMessageToAPI(message) {
	try {
		// Replace this with your actual API endpoint
		const response = await fetch('/api/messages', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(message),
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		return await response.json();
	} catch (error) {
		console.error('API call failed:', error);
		throw error;
	}
}
