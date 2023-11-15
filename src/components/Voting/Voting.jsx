import React, { Component } from 'react';
import SmileCard from '../SmileCard';
import PropTypes from 'prop-types';

import './Voting.scss';

class Voting extends Component {
  constructor(props) {
    super(props);

    // Initialize the state with an empty object for votes
    this.state = {
      candidates: [],
      votes: {},
      winner: null,
    };
  }

  static propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    smile: PropTypes.string.isRequired,
    onVote: PropTypes.func.isRequired,
  };

  handleVote = (id) => {
    this.setState({
      votes: {
        ...this.state.votes,
        [id]: (this.state.votes[id] || 0) + 1,
      },
    });
  };

  findWinner = () => {
    const { votes, candidates } = this.state;
    const winnerId = Object.keys(votes).reduce((a, b) => (votes[a] > votes[b] ? a : b));
    const winner = candidates.find((candidate) => candidate.id === parseInt(winnerId, 10));
    return winner;
  };

  handleShowResults = () => {
    const winner = this.findWinner();
    this.setState({ winner });
  };

  componentDidMount() {
    fetch('http://localhost:3000/data.json')
      .then((res) => res.json())
      .then((result) => {
        const ids = result.map((item) => item.id);

        this.setState({
          candidates: result,
          votes: ids.reduce((acc, id) => {
            acc[id] = 0;
            return acc;
          }, {}),
        });
      });
  }

  render() {
    const { winner, votes } = this.state;

    return (
      <div>
        <h1>Выберите лучшую улыбку:</h1>
        <div className='container'>
          {!this.state.candidates.length && <div>No candidates yet...</div>}

          {this.state.candidates.map((item) => (
            <div key={item.id}>
              <SmileCard
                id={item.id}
                title={item.title}
                description={item.description}
                smile={item.smile}
                onVote={this.handleVote}
              />
              {votes[item.id]}
            </div>
          ))}

          <button className='btn' onClick={this.handleShowResults}>Показать результаты</button>

          {winner && (
            <div>
              <h2>Победитель:</h2>
              <p>{winner.title}</p>
              <p>Голосов: {votes[winner.id]}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Voting;