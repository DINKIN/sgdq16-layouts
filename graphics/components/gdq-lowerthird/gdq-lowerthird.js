(function () {
	'use strict';

	const interviewNames = nodecg.Replicant('interviewNames');

	Polymer({
		is: 'gdq-lowerthird',

		properties: {
			numNames: {
				type: Number,
				reflectToAttribute: true
			}
		},

		ready() {
			const tl = new TimelineLite({autoRemoveChildren: true});

			nodecg.Replicant('interviewLowerthirdShowing').on('change', newVal => {
				if (newVal) {
					// Set names
					tl.call(() => {
						this.style.willChange = 'height';
						this.$.names.style.willChange = 'height';
						this.$.dropdown.style.willChange = 'transform';
						this.names = interviewNames.value.filter(name => Boolean(name));
						this.numNames = this.names.length;

						const greebles = [];
						const numGreebles = Math.max(2, this.numNames);
						for (let i = 0; i < numGreebles; i++) {
							greebles.push(true);
						}
						this.greebles = greebles;

						Polymer.dom.flush();
					}, null, null, '+=0.2'); // Give time for interviewNames replicant to update.

					// Fit names
					tl.call(() => {
						const padding = this.numNames === 4 ? 24 : 36;
						const nameDivs = Array.from(this.querySelectorAll('.name'));
						const maxNameWidth = nameDivs[0].parentNode.clientWidth - padding;
						nameDivs.forEach(nameDiv => {
							const nameWidth = nameDiv.scrollWidth;
							if (nameWidth > maxNameWidth) {
								TweenLite.set(nameDiv, {scaleX: maxNameWidth / nameWidth});
							} else {
								TweenLite.set(nameDiv, {scaleX: 1});
							}
						});
					});

					tl.to(this, 1, {
						height: 153,
						ease: Power3.easeInOut
					});

					tl.call(() => {
						TweenLite.to(this.$.names, 0.65, {
							height: this.numNames === 4 ? 48 : 65,
							ease: Power3.easeInOut
						});
					}, null, this, '-=0.8');

					tl.call(() => {
						TweenLite.to(this.$.dropdown, 0.65, {
							y: this.numNames === 4 ? 41 : 58,
							ease: Power3.easeOut
						});
					}, null, this, '-=0.4');
				} else {
					tl.to(this, 0.9, {
						height: 0,
						ease: Power3.easeIn
					});

					tl.set([this, this.$.names, this.$.dropdown], {clearProps: 'all'});
				}
			});
		}
	});
})();
