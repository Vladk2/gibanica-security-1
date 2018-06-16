class AgentsController < ApplicationController
  skip_before_action :authenticate_user, except: [:create]
  before_action :agent_params, only: [:create]

  # GET /agents
  def index
    @agents = Agent.all

    render json: @agents
  end

  # POST /agents
  def create
    @agent = Agent.new(agent_params)

    if @agent.save!
      render json: @agent, status: :created
    else
      render json: @agent.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /agents/1
  def update
    if @agent.update(agent_params)
      render json: @agent, status: :ok
    else
      render json: @agent.errors, status: :unprocessable_entity
    end
  end

  private

  # Only allow a trusted parameter "white list" through.
  def agent_params
    params.require(:agent).permit(:name, :type, :address, :host, :super, paths: [])
  end
end
