import { GamePlayersService } from './../services/game-players.service';
import { PlayerDataService } from '../services/player-data.service';
import { Player } from './../classes/player';
import { ConnData } from './../classes/conn-data';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConnectionService } from '../services/connection.service';
import { DeckService } from '../services/deck.service';
import { ConnDataType } from '../classes/conn-data';
import { take } from 'rxjs/operators';

@Component({
	selector: 'mc-host',
	templateUrl: './host.component.html',
	styleUrls: ['./host.component.scss'],
})
export class HostComponent implements OnInit {
	public player: Player;
	public roomName: string;
	public statusMsg = 'Shuffling  Cards...';
	public deckReady = false;

	constructor(
		private route: ActivatedRoute,
		private conn: ConnectionService,
		private cd: ChangeDetectorRef,
		private deckService: DeckService,
		private playerDataService: PlayerDataService,
		public gamePlayersService: GamePlayersService
	) {}

	ngOnInit() {
		this.gamePlayersService.setStatusMessage(
			'Waiting for Host to start the game.'
		);
		this.gamePlayersService.addNewLocalPlayer('Host');

		this.route.params.subscribe((params) => {
			this.roomName = params.name;
			// this.player.name = params.player;
			// this.hostId = params.hostId;
			this.stablishConnection();
		});
	}

	drawCard() {
		const card = this.deckService.drawFromDeck(1);
		const pileCard = card[0];
		this.deckService.putCardInPile(pileCard);
		this.cd.detectChanges();
	}

	stablishConnection() {
		// HOST
		console.log('LOG:', this.playerDataService.playerName);
		this.conn
			.createPeer(this.playerDataService.playerName, this.roomName)
			.pipe(take(1))
			.subscribe(() => {});

		this.conn.connection$.subscribe((data: ConnData) => {
			switch (data.type) {
				case ConnDataType.HANDSHAKE:
					this.conn.sendDataClients(ConnDataType.HANDSHAKE, data.player);
					this.conn.sendDataClients(
						ConnDataType.STAUS,
						'Waiting for HOST to start the Game.',
						this.playerDataService.playerName
					);
					this.gamePlayersService.addNewPlayer(data.player);
					break;
				case ConnDataType.MSG:
					this.conn.sendDataClients(ConnDataType.MSG, data.data, data.player);
					break;
			}
		});
	}

	startGame() {
		this.gamePlayersService.startNewGame();
		this.gamePlayersService.allPlayers.forEach((player: Player) => {
			this.conn.sendDataClients(ConnDataType.DEAL, player);
		});
	}
}
