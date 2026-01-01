from flask import Flask, render_template, request, jsonify
import random
from datetime import datetime

app = Flask(__name__)

# Game State
stats = {
    'win': 0,
    'lose': 0,
    'tie': 0
}
history = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/play', methods=['POST'])
def play():
    data = request.get_json()
    user_choice = data.get('choice')
    
    if user_choice not in ['rock', 'paper', 'scissors']:
        return jsonify({'error': 'Invalid choice'}), 400
        
    choices = ['rock', 'paper', 'scissors']
    computer_choice = random.choice(choices)
    
    result = determine_winner(user_choice, computer_choice)
    
    # Update stats
    stats[result] += 1
    
    # Update history
    game_number = len(history) + 1
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M')
    
    game_record = {
        'id': game_number,
        'timestamp': timestamp,
        'user': user_choice,
        'computer': computer_choice,
        'result': result
    }
    history.insert(0, game_record) # Add to beginning
    
    return jsonify({
        'user_choice': user_choice,
        'computer_choice': computer_choice,
        'result': result,
        'stats': stats,
        'history': history,
        'game_count': len(history)
    })

def determine_winner(user, computer):
    if user == computer:
        return 'tie'
    
    if (user == 'rock' and computer == 'scissors') or \
       (user == 'paper' and computer == 'rock') or \
       (user == 'scissors' and computer == 'paper'):
        return 'win'
        
    return 'lose'

if __name__ == '__main__':
    app.run(debug=True)
