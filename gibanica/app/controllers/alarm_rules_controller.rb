class AlarmRulesController < ApplicationController
  before_action :set_alarm_rule, only: %i[show update destroy]

  # GET /alarm_rules
  def index
    @alarm_rules = AlarmRule.all

    render json: @alarm_rules
  end

  # GET /alarm_rules/1
  def show
    render json: @alarm_rule
  end

  # POST /alarm_rules
  def create
    # authorize
    @alarm_rule = AlarmRule.new(alarm_rule_params)

    if @alarm_rule.save
      render json: @alarm_rule, status: :created, location: @alarm_rule
    else
      render json: @alarm_rule.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /alarm_rules/1
  def update
    if @alarm_rule.update(alarm_rule_params)
      render json: @alarm_rule
    else
      render json: @alarm_rule.errors, status: :unprocessable_entity
    end
  end

  # DELETE /alarm_rules/1
  def destroy
    @alarm_rule.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_alarm_rule
    @alarm_rule = AlarmRule.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def alarm_rule_params
    params.require(:alarm_rule).permit(
      :message,
      :start_date,
      :end_date,
      :count,
      :interval,
      rule_criteria: %i[attribute value]
    )
  end
end
