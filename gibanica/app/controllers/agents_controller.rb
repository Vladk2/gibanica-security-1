class AgentsController < ApplicationController
  skip_before_action :authenticate_user, only: [:create]
  before_action :agent_params, only: %i[create update]
  before_action :set_agent, only: [:update]

  # GET /agents
  def index
    @agents = Agent.all

    render json: @agents
  end

  # POST /agents
  def create
    @agent = Agent.new(agent_params)

    if @agent.save
      render json: @agent, status: :created
    else
      render json: @agent.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /agents/1
  def update
    if @agent.update(agent_params)
      AgentsNotifyJob.perform_later
      render json: @agent, status: :ok
    else
      render json: @agent.errors, status: :unprocessable_entity
    end
  end

  private

  def set_agent
    @agent = Agent.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def agent_params
    params.require(:agent).permit(:id, :name, :type, :address, :host, :super, paths: %i[path format])
  end
end
