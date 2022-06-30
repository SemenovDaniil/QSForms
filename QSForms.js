define([
	"qlik",
	"css!./styles/qsBootstrap.css",
	"css!./styles/styles.css",
	"css!./styles/bootstrap-icons.css"

],
function(qlik) {
	var mustRendered
	var isOpenNow = true
	var timer = []
	var formIdInLocalStorage

	function clearTimeOuts() {
		for (var i = 0; i < timer.length; i++) {
			clearTimeout(timer[i]);
		}
	}
	const app = qlik.currApp();
	const selectionState = app.selectionState();

	var fieldlist = [];

	function getUserVariable() {
		var app = qlik.currApp();
		app.getList('FieldList', function(fields) {
			fieldlist = [];
			$.each(fields.qFieldList.qItems, function(key, value) {
				fieldlist.push({
					value: value.qName,
					label: value.qName
				})
			})
		});
	}
	getUserVariable();

	return {
		definition: {
			type: "items",
			component: "accordion",
			items: {
				formId: {
					label: 'Form parametres',
					items: [{
							ref: "formId",
							label: "Id form",
							type: "string",
							defaultValue: "QsFormId"
						},
						{
							ref: "formLabel",
							label: "Form label",
							type: "string",
							defaultValue: "Please take the survey"
						},
						{
							ref: "isOnceTakeSurvey",
							label: "Can only be passed once?",
							type: "boolean",
							component: "switch",
							defaultValue: true,
							options: [{
									value: true,
									label: "yes"
								},
								{
									value: false,
									label: "no"
								}
							]
						},
						{
							show: function(e) {
								return e.isOnceTakeSurvey
							},
							ref: "messageWhoAlreadyComplete",
							type: "string",
							label: "Message for users who have already completed the survey",
							defaultValue: "Survey already completed"
						}
					]

				},
				displayMode: {
					label: "Display mode",
					items: {
						mode: {
							component: "radiobuttons",
							label: "Display mode",
							ref: "displayMode",
							options: [{
									value: "standart",
									label: "Standart"
								},
								{
									value: "popup",
									label: "Pop-up"
								}
							]
						},
						userCan: {
							show: function(e) {
								if (e.displayMode == 'popup') {
									return true
								} else {
									return false
								}
							},
							items: [{
									ref: "isAnotherContentBlocked",
									label: "Block another content?",
									type: "boolean",
									component: "switch",
									defaultValue: true,
									options: [{
											value: true,
											label: "yes"
										},
										{
											value: false,
											label: "no"
										}
									]
								},
								{
									ref: "isCanCloseForm",
									label: "Can the user close the form?",
									type: "boolean",
									component: "switch",
									defaultValue: true,
									options: [{
											value: true,
											label: "yes"
										},
										{
											value: false,
											label: "no"
										}
									]
								},
								{
									ref: "isFormDontShowAgain",
									label: "Form not showing after closing?",
									type: "boolean",
									component: "switch",
									defaultValue: true,
									options: [{
											value: true,
											label: "yes"
										},
										{
											value: false,
											label: "no"
										}
									]
								}
							]
						},
						triggers: {
							show: function(e) {
								if (e.displayMode == 'popup') {
									return true
								} else {
									return false
								}
							},
							type: "array",
							ref: "triggers",
							label: "triggers",
							itemTitleRef: "label",
							allowAdd: true,
							allowRemove: true,
							addTranslation: "Add trigger",
							items: {
								triggerLAbel: {
									type: "string",
									ref: "label",
									label: "Trigger label"
								},
								triggerType: {
									component: "radiobuttons",
									label: "Trigger type",
									ref: "type",
									options: [{
											value: "onTimeOut",
											label: "On timeout"
										},
										{
											value: "onFieldChange",
											label: "On change in field"
										},

									]
								},
								triggerField: {
									show: function(e) {
										if (e.type == 'onFieldChange') {
											return true
										} else {
											return false
										}
									},
									type: "string",
									component: "dropdown",
									label: "Field",
									ref: "field",
									options: function() {
										return fieldlist

									}
								},
								triggerTimeOut: {
									label: "timeout in seconds",
									ref: "timeout",
									type: "integer",
									defaultValue: 10
								},
							}
						},
						formPosition: {
							show: function(e) {
								if (e.displayMode == 'popup') {
									return true
								} else {
									return false
								}
							},
							label: "Pop-up form position",
							items: [{
									ref: "positionRight",
									label: "Right (in px)",
									type: "integer",
									defaultValue: 10
								},
								{
									ref: "positionBottom",
									label: "Bottom (in px)",
									type: "integer",
									defaultValue: 10
								},
								{
									ref: "positionHeight",
									label: "Height (in px)",
									type: "integer",
									defaultValue: 400
								},
								{
									ref: "positionWidth",
									label: "Width (in px)",
									type: "integer",
									defaultValue: 700
								}

							]
						}
					},

				},
				form: {
					label: "Form configuration",
					items: {
						formStyle: {
							component: "radiobuttons",
							label: "Form type",
							ref: "form.type",
							options: [{
									value: "allCards",
									label: "All cards"
								},
								{
									value: "oneCard",
									label: "One card at a time"
								}
							]
						},
						questions: {
							type: "array",
							ref: "questions",
							label: "questions",
							itemTitleRef: "label",
							allowAdd: true,
							allowRemove: true,
							addTranslation: "Add question",

							items: {
								question: {
									type: "string",
									ref: "label",
									label: "Question",
									expression: "optional"
								},
								answerType: {
									component: "radiobuttons",
									label: "Answer type",
									ref: "answer.type",
									options: [{
											value: "textInput",
											label: "Text input"
										},
										{
											value: "multipleSelect",
											label: "Multiple select"
										},
										{
											value: "singleSelect",
											label: "Single select"
										},
										{
											value: "grade",
											label: "Grade"
										}
									]
								},
								grades: {
									show: function(e) {
										if (e.answer.type == 'grade') {
											return true
										} else {
											return false
										}
									},
									items: {
										min: {
											type: "string",
											ref: "grade.min",
											label: "min",
											expression: "optional"
										},
										max: {
											type: "string",
											ref: "grade.max",
											label: "max",
											expression: "optional"
										}
									}

								},
								answers: {
									type: "array",
									ref: "answers",
									label: "answers",
									itemTitleRef: "answer",
									allowAdd: true,
									allowRemove: true,
									addTranslation: "Add answer",
									show: function(e) {
										if (e.answer.type == 'multipleSelect' || e.answer.type == 'singleSelect') {
											return true
										} else {
											return false
										}
									},
									items: {
										answer: {
											type: "string",
											ref: "answer",
											label: "Answer",
											expression: "optional"
										}
									}
								},
								submit: {
									show: function(e, c) {
										if (c.layout.form.type == 'oneCard' && (e.answer.type != 'textInput' && e.answer.type != 'multipleSelect')) {
											return true
										} else {
											return false
										}
									},
									items: {
										submitType: {
											component: "radiobuttons",
											label: "Submit type",
											ref: "submit.type",

											options: [{
													value: "byButton",
													label: "By button"
												},
												{
													value: "byInput",
													label: "By input"
												}
											]
										}

									}
								},
								buttonLabel: {
									show: function(e, c) {
										if (c.layout.form.type == 'oneCard' && e.submit.type == 'byButton') {
											return true
										} else {
											return false
										}
									},
									type: "string",
									ref: "buttonLabel",
									label: "Button Label",
									expression: "optional"
								}
							}
						}
					}
				},
				writeback: {
					label: "Web service params",
					type: "items",
					items: {
						writebackConf: {
							ref: "writeback.conf",
							label: "web service url",
							type: "string"
						}
					}
				},
				appearance: {
					uses: "settings"
				}
			}
		},
		support: {
			snapshot: false,
			export: false,
			exportData: false
		},
		mounted: function() {
			console.log('mount')
			mustRendered = true
			isOpenNow = true
			
		},
		updateData: function() {
			clearTimeOuts()
			localStorage.removeItem(formIdInLocalStorage)
			selectionState.OnData.unbind()
			var currentClass = this.$element[0].id
			$('#blocked.' + currentClass).remove()
			$('#qsform.' + currentClass).remove()
			mustRendered = true
			return qlik.Promise.resolve();
		},
		beforeDestroy: function() {
			clearTimeOuts()
			selectionState.OnData.unbind()
			localStorage.removeItem(formIdInLocalStorage)
			var currentClass = this.$element[0].id
			$('#qsform.' + currentClass).remove()
			$('#blocked.' + currentClass).remove()

		},
		paint: function($element, layout) {
			if (mustRendered) {
				formIdInLocalStorage = layout.formId
				localStorage.removeItem(formIdInLocalStorage)
				$element.html("")
				var right = layout.positionRight
				var bottom = layout.positionBottom
				var height = layout.positionHeight
				var width = layout.positionWidth
				var timeout = layout.timeout * 1000
				const currentClass = $element[0].parentNode.attributes.id.nodeValue
				const tid = currentClass.replace('_content', '')

				$('div[tid="' + tid + '"] article').css('display', '')
				$('#qsform.' + currentClass).remove()



				if (layout.isOnceTakeSurvey) {
					app.model.enigmaModel.evaluate('OSUser()').then(function(user) {
						$.ajax({
							url: layout.writeback.conf,
							method: "GET",
							data: {
								osUser: user,
								formId: layout.formId
							}
						}).done(function(response) {
							if (response.isExists) {
								if (layout.displayMode == 'popup') {
									$('div[tid="' + tid + '"] article').css('display', 'none')
								} else {
									$element.append('<div  class="qs_bootstrap card text-center' + currentClass + '"><div class="card-body"><h5 class="card-title">' + layout.messageWhoAlreadyComplete + '</h5></div></div>')
								}
							} else {
								paintForm()
							}
						})
					})
				} else {
					paintForm()
				}


				function paintForm() {
					clearTimeOuts()
					$('#blocked.' + currentClass).remove()
					$('#qsform.' + currentClass).remove()
					$element.append('<div id="qsform" class="qs_bootstrap ' + currentClass + '"><legend>' + layout.formLabel + '</legend></div>')

					if (layout.displayMode == 'popup') {
						$('div[tid="' + tid + '"] article').css('display', 'none')
						var obj = $('div[tid="' + tid + '"] .qv-object-content-container #qsform')
						$(obj).hide()
						if (layout.isCanCloseForm) {
							$(obj).prepend('<i class="bi bi-x-square-fill float-end"></i>')
							$(obj).find('i.bi-x-square-fill').on('click', function() {
								if (layout.isFormDontShowAgain) {
									localStorage[formIdInLocalStorage] = 1
								}
								$('#qsform.' + currentClass).slideUp(500)
								$('#blocked.' + currentClass).remove()
							})
						}

						function findMinTimeout() {
							var timeOuts = []
							var timeOutsPromises = []
							layout.triggers.forEach(function(trigger, index) {
								timeOutsPromises.push(new Promise(function(resolve, reject) {
									if (trigger.type == 'onTimeOut') {
										timeOuts.push(trigger.timeout)
										resolve()
									} else {
										app.model.enigmaModel.evaluate("count({$/$1}" + trigger.field + ")").then(function(result) {
											if (result > 0 && !isOpenNow) {
												timeOuts.push(trigger.timeout)
											}
											resolve()
										})
									}
								}))
							})

							Promise.all(timeOutsPromises).then(function() {
								console.log(timeOuts)
								if (timeOuts.length > 0) {
									clearTimeOuts()
									timeout(Math.min.apply(Math, timeOuts))
								}
								/*if(flagMountFromAnotherSheet){
									flagMountFromAnotherSheet = false
								}*/

							})
						}

						findMinTimeout()

						selectionState.OnData.bind(function() {
							if (localStorage[formIdInLocalStorage] != 1) {
								app.createGenericObject({
									qInfo: {
										qType: 'appprops'
									},
									qAppObjectListDef: {
										qType: 'appprops',

										qData: {
											"theme": "/theme",
											"defaultBookmarkId": "/defaultBookmarkId"
										}
									}
								}, appProps => {
									if (appProps.qAppObjectList.qItems[0].qData.defaultBookmarkId != null) {
										if (selectionState.backCount > 1) {
											isOpenNow = false
											findMinTimeout()
										}
									} else {
										isOpenNow = false
										findMinTimeout()
									}
								})
							}




						});

						function timeout(timeout) {
							if (layout.form.type == 'oneCard') {
								rePaintOneCard()
							}
							timer.push(setTimeout(function() {
								$(obj).appendTo('body .qvt-sheet-container .qvt-sheet')
								$(obj).css('left', '').css('top', '').css('right', right + 'px').css('bottom', bottom + 'px').css('position', 'absolute').css('height', height + 'px').css('width', width + 'px').css('z-index', '1022').css('background', 'white')
									.css('padding', '10px').css('box-shadow', '0 14px 28px rgb(0 0 0 / 25%), 0 10px 10px rgb(0 0 0 / 22%)')
								$(obj).slideDown(500)
								if (layout.isAnotherContentBlocked) {
									$('body .qvt-sheet-container .qvt-sheet').append('<div id="blocked" class="' + currentClass + '"></div>')
								}
							}, timeout * 1000));
						}

					}

					var _thisForm = $('#qsform.' + currentClass)

					var questions = layout.questions;

					function paintCard(question, index, _thisForm) {
						var cardIndex = 'question' + index
						$(_thisForm).append('<div class="card ' + cardIndex + '"></div>')
						var _thisCard = $(_thisForm).find('.' + cardIndex)
						$(_thisCard).append('<div class="card-body"></div>')
						var _thisCardBody = $(_thisCard).find('.card-body')
						$(_thisCardBody).append('<h5 class="card-title">' + question.label + '</h5>')
						switch (question.answer.type) {
							case 'multipleSelect':
								question.answers.forEach(function(answer, answerIndex) {
									$(_thisCardBody).append('<div class="form-check ' + answerIndex + '"></div>')
									var _thisFormCheck = $(_thisCardBody).find('.form-check.' + answerIndex)
									$(_thisFormCheck).append('<input class="form-check-input" type="checkbox" value="" id="' + cardIndex + 'answer' + answerIndex + '"><label class="form-check-label" for="' + cardIndex + 'answer' + answerIndex + '">' + answer.answer + '</label>')
								})
								break
							case 'singleSelect':
								question.answers.forEach(function(answer, answerIndex) {
									var checked = answerIndex == 0 ? 'checked' : ''
									$(_thisCardBody).append('<div class="form-check ' + answerIndex + '"></div>')
									var _thisFormCheck = $(_thisCardBody).find('.form-check.' + answerIndex)
									$(_thisFormCheck).append('<input class="form-check-input" type="radio" name="' + cardIndex + '" value="" id="' + cardIndex + 'answer' + answerIndex + '"' + checked + '><label class="form-check-label" for="' + cardIndex + 'answer' + answerIndex + '">' + answer.answer + '</label>')
								})
								break
							case 'textInput':
								$(_thisCardBody).append('<label for="exampleFormControlTextarea1">Enter answer</label>')
								$(_thisCardBody).append('<textarea class="form-control" id="' + cardIndex + 'textArea" rows="1"></textarea>')
								break
							case 'grade':
								for (i = question.grade.min; i <= question.grade.max; i++) {
									$(_thisCardBody).append('<button type="button" class="btn btn-outline-primary grade' + i + '" style="margin-right:10px;min-width:50px">' + i + '</button>')
								}
								$(_thisCardBody).find('.btn').on('click', function() {
									$(_thisCardBody).find('.btn').removeClass('btn-primary').addClass('btn-outline-primary')
									$(this).removeClass('btn-outline-primary')
									$(this).addClass('btn-primary')
								})
								break
						}
					}


					if (layout.form.type == 'allCards') {
						questions.forEach(function(question, index) {
							paintCard(question, index, _thisForm)
						})
						$(_thisForm).append('<div class="float-end"><div class="submitButton" ><button type="submit" class="btn btn-primary mb-2">Submit</button></div></div>')
						$(_thisForm).find('.submitButton').on('click', function() {
							var exportData = {};
							exportData["document"] = {}
							var thePromises = []

							/*Add current form id*/
							thePromises.push(new Promise(function(resolve, reject) {
								exportData["formId"] = layout.formId
								resolve("Current form id added")
							}))

							/*Add submit date*/
							thePromises.push(new Promise(function(resolve, reject) {
								app.model.enigmaModel.evaluate('now()').then(function(date) {
									exportData["submitDate"] = date;
									resolve("Current submit date added")
								})

							}))

							/*Get current user block*/
							thePromises.push(new Promise(function(resolve, reject) {
								app.model.enigmaModel.evaluate('OSUser()').then(function(user) {
									exportData["osUser"] = user;
									resolve("Current user added")
								});
							}))
							/*Get documentID block*/
							thePromises.push(new Promise(function(resolve, reject) {
								app.model.enigmaModel.evaluate('DocumentName()').then(function(doc) {
									exportData["document"]["id"] = doc;
									resolve("Current document id added")
								});
							}))
							/*Get document title block*/
							thePromises.push(new Promise(function(resolve, reject) {
								app.model.enigmaModel.evaluate('DocumentTitle()').then(function(docTitle) {
									exportData["document"]["title"] = docTitle;
									resolve("Current document title added")
								});
							}))
							/*Get current sheet block*/
							thePromises.push(new Promise(function(resolve, reject) {
								var currentSheet = qlik.navigation.getCurrentSheetId();

								qlik.currApp(this).getObjectProperties(currentSheet.sheetId).then(function(model) {
									exportData["sheet"] = {
										"id": currentSheet.sheetId,
										"title": model.properties.qMetaDef.title
									}
									resolve("Current sheet added")
								});
							}))
							/*Get current selections block*/
							thePromises.push(new Promise(function(resolve, reject) {
								app.model.enigmaModel.evaluate("GetCurrentSelections('|')").then(function(selections) {
									exportData["currentSelections"] = selections;
									resolve("Current selections added")
								});
							}))

							exportData["answers"] = []
							questions.forEach(function(question, index) {
								thePromises.push(new Promise(function(resolve, reject) {
									var cardIndex = 'question' + index
									switch (question.answer.type) {
										case 'textInput':
											exportData.answers.push({
												"questionIndex": index,
												"questionType": question.answer.type,
												"question": question.label,
												"answer": $(_thisForm).find('.' + cardIndex).find('textarea').val()
											})
											resolve()
											break
										case 'multipleSelect':
										case 'singleSelect':
											$('.card.question' + index + ' input').each(function() {
												if ($(this).prop("checked")) {
													exportData.answers.push({
														"questionIndex": index,
														"questionType": question.answer.type,
														"question": question.label,
														"answer": $(this).parent().find('label').html()
													})
												}
											})
											resolve()
											break
										case 'grade':
											exportData.answers.push({
												"questionIndex": index,
												"questionType": question.answer.type,
												"question": question.label,
												"answer": parseInt($('.card.question' + index + ' .btn-primary').html())
											})
											resolve()
											break
									}


								}))
							})

							Promise.all(thePromises).then(function() {
								sendResult(exportData)
							});

						})
					}
					var exportData = {};
					exportData["answers"] = []
					thePromises = []

					function saveAnswer(question, index) {
						var cardIndex = 'question' + index
						thePromises.push(new Promise(function(resolve, reject) {
							switch (question.answer.type) {
								case 'textInput':
									exportData.answers.push({
										"questionIndex": index,
										"questionType": question.answer.type,
										"question": question.label,
										"answer": $(_thisForm).find('.' + cardIndex).find('textarea').val()
									})
									resolve()
									break
								case 'multipleSelect':
								case 'singleSelect':
									$('.card.question' + index + ' input').each(function() {
										if ($(this).prop("checked")) {
											exportData.answers.push({
												"questionIndex": index,
												"questionType": question.answer.type,
												"question": question.label,
												"answer": $(this).parent().find('label').html()
											})
										}
									})
									resolve()
									break
								case 'grade':
									exportData.answers.push({
										"questionIndex": index,
										"questionType": question.answer.type,
										"question": question.label,
										"answer": parseInt($('.card.question' + index + ' .btn-primary').html())
									})
									resolve()
									break
							}
						}))
					}

					function sendOneCardAnswers() {
						exportData["document"] = {}
						/*Add current form id*/
						thePromises.push(new Promise(function(resolve, reject) {
							exportData["formId"] = layout.formId
							resolve("Current form id added")
						}))

						/*Add submit date*/
						thePromises.push(new Promise(function(resolve, reject) {
							app.model.enigmaModel.evaluate('now()').then(function(date) {
								exportData["submitDate"] = date;
								resolve("Current submit date added")
							})

						}))

						/*Get current user block*/
						thePromises.push(new Promise(function(resolve, reject) {
							app.model.enigmaModel.evaluate('OSUser()').then(function(user) {
								exportData["osUser"] = user;
								resolve("Current user added")
							});
						}))
						/*Get documentID block*/
						thePromises.push(new Promise(function(resolve, reject) {
							app.model.enigmaModel.evaluate('DocumentName()').then(function(doc) {
								exportData["document"]["id"] = doc;
								resolve("Current document id added")
							});
						}))
						/*Get document title block*/
						thePromises.push(new Promise(function(resolve, reject) {
							app.model.enigmaModel.evaluate('DocumentTitle()').then(function(docTitle) {
								exportData["document"]["title"] = docTitle;
								resolve("Current document title added")
							});
						}))
						/*Get current sheet block*/
						thePromises.push(new Promise(function(resolve, reject) {
							var currentSheet = qlik.navigation.getCurrentSheetId();

							qlik.currApp(this).getObjectProperties(currentSheet.sheetId).then(function(model) {
								exportData["sheet"] = {
									"id": currentSheet.sheetId,
									"title": model.properties.qMetaDef.title
								}
								resolve("Current sheet added")
							});
						}))
						/*Get current selections block*/
						thePromises.push(new Promise(function(resolve, reject) {
							app.model.enigmaModel.evaluate("GetCurrentSelections('|')").then(function(selections) {
								exportData["currentSelections"] = selections;
								resolve("Current selections added")
							});
						}))

						Promise.all(thePromises).then(function() {
							sendResult(exportData)
						})

					}


					function oneCard(currentIndex, _thisForm) {
						$(_thisForm).html("")
						$(_thisForm).append('<legend>' + layout.formLabel + '</legend>')
						if (layout.isCanCloseForm) {
							$(_thisForm).prepend('<i class="bi bi-x-square-fill float-end"></i>')
							$(_thisForm).find('i.bi-x-square-fill').on('click', function() {
								if (layout.isFormDontShowAgain) {
									localStorage[formIdInLocalStorage] = 1
								}
								$('#qsform.' + currentClass).slideUp(500)
								$('#blocked.' + currentClass).remove()
							})
						}
						question = questions[currentIndex]
						paintCard(question, currentIndex, _thisForm)
						var currentCard = $('.card.question' + currentIndex)
						if (question.submit.type == 'byButton') {
							$(_thisForm).append('<div class="float-end"><div class="nextButton" ><button type="submit" class="btn btn-primary mb-2">' + question.buttonLabel + '</button></div></div>')
							$(_thisForm).find('.nextButton').on('click', function() {
								if (currentIndex == questions.length - 1) {
									saveAnswer(question, currentIndex)
									sendOneCardAnswers()
									$(_thisForm).find('.nextButton button').prop('disabled', true)
									$(_thisForm).find('.nextButton').off('click')
								} else {
									saveAnswer(question, currentIndex)
									currentIndex += 1
									currentIndex = oneCard(currentIndex, _thisForm)
								}


							})
						} else {
							if (question.answer.type == 'grade') {
								$('.card.question' + currentIndex + ' .btn').on('click', function() {
									if (currentIndex == questions.length - 1) {
										saveAnswer(question, currentIndex)
										sendOneCardAnswers()
									} else {
										saveAnswer(question, currentIndex)
										currentIndex += 1
										currentIndex = oneCard(currentIndex, _thisForm)
									}
								})
							}
							if (question.answer.type == 'singleSelect') {
								$('.card.question' + currentIndex + ' .form-check-input').on('click', function() {
									if (currentIndex == questions.length - 1) {
										saveAnswer(question, currentIndex)
										sendOneCardAnswers()
									} else {
										saveAnswer(question, currentIndex)
										currentIndex += 1
										currentIndex = oneCard(currentIndex, _thisForm)
									}
								})
							}
						}



						return currentIndex + 1
					}

					function rePaintOneCard() {
						exportData["answers"] = []
						var firstCardIndex = 0
						var lastCardIndex = questions.length - 1
						var currentIndex = firstCardIndex

						oneCard(currentIndex, _thisForm)
					}
					if (layout.form.type == 'oneCard') {
						rePaintOneCard()
					}

					function sendResult(exportData) {
						var settings = {
							"crossDomain": true,
							"url": layout.writeback.conf,
							"method": "POST",
							"timeout": 0,
							"data": JSON.stringify(exportData)
						};

						$.ajax(settings).done(function(response) {
							localStorage[formIdInLocalStorage] = 1
							$(_thisForm).html("<h1>Thank you for taking the survey</h1>")
							if (layout.displayMode == 'popup') {
								$(obj).slideUp(500)
								$('#blocked.' + currentClass).remove()
							}


						});
					}
				}

			}
			if (layout.displayMode == 'popup') {
				mustRendered = false
				
			}


		}
	};

});



